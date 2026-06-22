import type { ApiErrorCode } from "@/shared/api/client";
import type { RuntimeKind } from "@/shared/config/runtime";
import type { CampaignSseEvent, RawSseMessage, SseEventName, TraceEventStatus, TraceEventType } from "@/shared/sse/events";

/**
 * isRecord 判断 unknown 是否是普通对象。
 *
 * 管理区域：
 * - SSE JSON 解析后的运行时校验。
 *
 * 改动影响：
 * - 不做这个判断会让错误 payload 在类型断言后污染页面状态。
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * readStringField 安全读取字符串字段。
 *
 * 管理区域：
 * - SSE 必填字符串字段校验。
 */
function readStringField(record: Record<string, unknown>, field: string) {
  const value = record[field];

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`SSE 事件字段缺失或类型错误：${field}`);
  }

  return value;
}

/**
 * readOptionalStringField 安全读取可选字符串字段。
 *
 * 管理区域：
 * - Trace detail、toolName、assetId 等可选字段。
 */
function readOptionalStringField(record: Record<string, unknown>, field: string) {
  const value = record[field];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`SSE 事件可选字段类型错误：${field}`);
  }

  return value;
}

/**
 * isSseEventName 判断事件名是否属于 Phase 1 白名单。
 *
 * 改动影响：
 * - 后端推送未知事件时，前端会抛出中文错误，避免静默丢数据。
 */
function isSseEventName(value: string): value is SseEventName {
  return value === "run_started" || value === "message_delta" || value === "trace_event" || value === "run_finished" || value === "run_failed";
}

/**
 * isRuntimeKind 判断 Runtime 是否属于双语言实现范围。
 *
 * 管理区域：
 * - Java Runtime。
 * - Python Runtime。
 *
 * 改动影响：
 * - 后续如果新增 go/node 等 Runtime，必须先扩展 contracts，再扩展这里。
 */
function isRuntimeKind(value: string): value is RuntimeKind {
  return value === "java" || value === "python";
}

/**
 * isTraceEventType 判断 Trace 类型是否属于 Phase 1 白名单。
 *
 * 管理区域：
 * - 右侧工作流面板。
 * - 后续 AgentOps 时间线。
 */
function isTraceEventType(value: string): value is TraceEventType {
  return (
    value === "planner_started" ||
    value === "planner_finished" ||
    value === "model_selected" ||
    value === "tool_call_started" ||
    value === "tool_call_finished" ||
    value === "asset_created" ||
    value === "review_started" ||
    value === "review_finished" ||
    value === "fallback_placeholder"
  );
}

/**
 * isTraceEventStatus 判断 Trace 状态是否属于 Phase 1 白名单。
 *
 * 改动影响：
 * - 新增状态会影响工作流面板样式和中文文案映射。
 */
function isTraceEventStatus(value: string): value is TraceEventStatus {
  return value === "pending" || value === "running" || value === "succeeded" || value === "failed";
}

/**
 * isApiErrorCode 判断错误码是否属于 contracts 白名单。
 *
 * 管理区域：
 * - SSE run_failed。
 * - HTTP 请求错误。
 */
function isApiErrorCode(value: string): value is ApiErrorCode {
  return (
    value === "RUNTIME_UNAVAILABLE" ||
    value === "SSE_CONNECT_FAILED" ||
    value === "SSE_STREAM_INTERRUPTED" ||
    value === "RUN_FAILED" ||
    value === "INVALID_REQUEST" ||
    value === "INVALID_RUNTIME" ||
    value === "UNKNOWN_EVENT_TYPE" ||
    value === "INVALID_ASSET_PAYLOAD" ||
    value === "EMPTY_HTML_PREVIEW" ||
    value === "NOT_FOUND"
  );
}

/**
 * SseTextParser 负责把 text/event-stream 文本切成原始事件。
 *
 * 管理区域：
 * - fetch ReadableStream 返回的任意分片。
 * - 多行 data 合并。
 *
 * 接口边界：
 * - 这里只解析 SSE 文本格式。
 * - 不解析 JSON，不更新 React state。
 */
export class SseTextParser {
  /** buffer 保存上一个网络分片没读完的半截 SSE 文本。 */
  private buffer = "";

  /**
   * push 写入一段新文本，并返回已经完整结束的 SSE 消息。
   *
   * 改动影响：
   * - SSE 协议用空行分隔事件，所以这里必须按 \n\n 切分。
   */
  push(chunk: string) {
    // 把 Windows 换行统一成 \n，避免 Java/Python 输出差异影响解析。
    this.buffer += chunk.replace(/\r\n/g, "\n");
    // parts 是按空行切开的片段，最后一段可能还没接收完整。
    const parts = this.buffer.split("\n\n");
    // 最后一段放回 buffer，等待下一次 push。
    this.buffer = parts.pop() ?? "";

    return parts.map(parseRawSseMessage).filter((message): message is RawSseMessage => message !== null);
  }

  /**
   * flush 在流结束时尝试解析剩余 buffer。
   *
   * 改动影响：
   * - 如果后端最后一个事件后没有空行，flush 可以避免丢最后一条。
   */
  flush() {
    const rest = this.buffer.trim();
    this.buffer = "";

    if (rest.length === 0) {
      return [];
    }

    const message = parseRawSseMessage(rest);
    return message === null ? [] : [message];
  }
}

/**
 * parseRawSseMessage 把单个 SSE 文本块解析为 event/data。
 *
 * 管理区域：
 * - event: xxx
 * - data: {...}
 *
 * 改动影响：
 * - 如果未来加入 id/retry 字段，可以在这里扩展。
 */
function parseRawSseMessage(block: string): RawSseMessage | null {
  // eventName 保存 event 行，缺省时用 message，Phase 1 不使用缺省事件。
  let eventName = "";
  // dataLines 保存所有 data 行，SSE 协议允许多行 data。
  const dataLines: string[] = [];

  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) {
      eventName = line.slice("event:".length).trim();
    }

    if (line.startsWith("data:")) {
      dataLines.push(line.slice("data:".length).trim());
    }
  }

  if (!eventName || dataLines.length === 0) {
    return null;
  }

  return {
    event: eventName,
    data: dataLines.join("\n")
  };
}

/**
 * parseCampaignSseMessage 把原始 SSE 消息解析成业务事件。
 *
 * 管理区域：
 * - 校验 event 行和 data.event 是否一致。
 * - 校验 Phase 1 必填字段。
 *
 * 接口边界：
 * - 这里是前端进入 reducer 前的最后一道协议防线。
 */
export function parseCampaignSseMessage(rawMessage: RawSseMessage): CampaignSseEvent {
  const jsonValue = JSON.parse(rawMessage.data) as unknown;

  if (!isRecord(jsonValue)) {
    throw new Error("SSE data 必须是 JSON 对象");
  }

  const eventName = readStringField(jsonValue, "event");

  if (!isSseEventName(rawMessage.event) || !isSseEventName(eventName)) {
    throw new Error(`未知 SSE 事件类型：${rawMessage.event || eventName}`);
  }

  if (rawMessage.event !== eventName) {
    throw new Error(`SSE event 行和 data.event 不一致：${rawMessage.event} / ${eventName}`);
  }

  const runtime = readStringField(jsonValue, "runtime");

  if (!isRuntimeKind(runtime)) {
    throw new Error(`未知 Runtime 类型：${runtime}`);
  }

  const base = {
    event: eventName,
    runId: readStringField(jsonValue, "runId"),
    threadId: readStringField(jsonValue, "threadId"),
    runtime,
    createdAt: readStringField(jsonValue, "createdAt")
  };

  switch (eventName) {
    case "run_started":
      return {
        ...base,
        event: "run_started",
        scenario: "summer_bubble_coffee_campaign",
        title: readStringField(jsonValue, "title")
      };
    case "message_delta":
      return {
        ...base,
        event: "message_delta",
        delta: readStringField(jsonValue, "delta")
      };
    case "trace_event":
      {
        const traceType = readStringField(jsonValue, "type");
        const traceStatus = readStringField(jsonValue, "status");

        if (!isTraceEventType(traceType)) {
          throw new Error(`未知 Trace 事件类型：${traceType}`);
        }

        if (!isTraceEventStatus(traceStatus)) {
          throw new Error(`未知 Trace 状态：${traceStatus}`);
        }

        return {
          ...base,
          event: "trace_event",
          eventId: readStringField(jsonValue, "eventId"),
          type: traceType,
          title: readStringField(jsonValue, "title"),
          detail: readOptionalStringField(jsonValue, "detail"),
          status: traceStatus,
          toolName: readOptionalStringField(jsonValue, "toolName"),
          assetId: readOptionalStringField(jsonValue, "assetId"),
          parentEventId: readOptionalStringField(jsonValue, "parentEventId"),
          durationMs: typeof jsonValue.durationMs === "number" ? jsonValue.durationMs : undefined,
          payload: isRecord(jsonValue.payload) ? jsonValue.payload : undefined
        };
      }
    case "run_finished":
      return {
        ...base,
        event: "run_finished",
        messageId: readStringField(jsonValue, "messageId"),
        assetIds: Array.isArray(jsonValue.assetIds) ? jsonValue.assetIds.filter((assetId): assetId is string => typeof assetId === "string") : []
      };
    case "run_failed":
      {
        const code = readStringField(jsonValue, "code");

        if (!isApiErrorCode(code)) {
          throw new Error(`未知错误码：${code}`);
        }

        return {
          ...base,
          event: "run_failed",
          code,
          message: readStringField(jsonValue, "message"),
          detail: readOptionalStringField(jsonValue, "detail")
        };
      }
  }
}
