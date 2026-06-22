import { buildRuntimeUrl, createApiError } from "@/shared/api/client";
import { buildRunStreamEndpoint } from "@/shared/api/endpoints";
import type { RuntimeKind } from "@/shared/config/runtime";
import type { CampaignSseEvent } from "@/shared/sse/events";
import { parseCampaignSseMessage, SseTextParser } from "@/shared/sse/parser";

/**
 * RunStreamRequest 是创建 Campaign Run 的请求体。
 *
 * 接口路径：
 * - POST /api/threads/{threadId}/runs/stream
 *
 * 对齐来源：
 * - contracts/openapi/agent-api.yaml components.schemas.RunRequest
 */
export type RunStreamRequest = {
  /** prompt 是用户输入的创意需求，会进入 Agent 规划上下文。 */
  prompt: string;
  /** scenario 是业务场景编码，Phase 1 固定为夏季气泡咖啡营销素材。 */
  scenario: "summer_bubble_coffee_campaign";
  /** mockMode 表示是否使用 mock 工具链；Phase 1 必须是 true。 */
  mockMode: boolean;
};

/**
 * RunStreamHandlers 是 SSE 生命周期回调。
 *
 * 管理区域：
 * - 连接开始。
 * - 每条业务事件。
 * - 连接错误。
 * - 连接结束。
 */
export type RunStreamHandlers = {
  /** onOpen 在 HTTP 连接成功并准备读取 SSE 时触发。 */
  onOpen?: () => void;
  /** onEvent 在每条 SSE 业务事件通过校验后触发。 */
  onEvent: (event: CampaignSseEvent) => void;
  /** onError 在网络、HTTP、解析或协议错误时触发。 */
  onError?: (error: Error) => void;
  /** onClose 在流正常结束或异常结束后的 finally 阶段触发。 */
  onClose?: () => void;
};

/**
 * StreamCampaignRunOptions 是启动 SSE 主链路所需的参数。
 *
 * 页面来源：
 * - 中间 Agent 输入框点击发送。
 *
 * 后端接口：
 * - Java Runtime: POST http://localhost:8080/api/threads/{threadId}/runs/stream
 * - Python Runtime: POST http://localhost:8000/api/threads/{threadId}/runs/stream
 */
export type StreamCampaignRunOptions = {
  /** runtime 决定连接 Java 还是 Python Runtime。 */
  runtime: RuntimeKind;
  /** threadId 是当前会话 ID，必须来自会话列表或创建会话接口。 */
  threadId: string;
  /** request 是创建 Run 的请求体。 */
  request: RunStreamRequest;
  /** handlers 是流式事件回调集合。 */
  handlers: RunStreamHandlers;
  /** signal 用于用户停止生成或页面卸载时取消 fetch。 */
  signal?: AbortSignal;
};

/**
 * streamCampaignRun 连接 Campaign Run SSE 主链路。
 *
 * 管理区域：
 * - 创建 Run。
 * - 读取 text/event-stream。
 * - 把原始 SSE 文本解析为 CampaignSseEvent。
 *
 * 接口边界：
 * - 本函数不直接修改 React state。
 * - 页面或 feature 层通过 handlers.onEvent 把事件交给 reducer。
 */
export async function streamCampaignRun({ runtime, threadId, request, handlers, signal }: StreamCampaignRunOptions) {
  // endpoint 是 OpenAPI 中的相对路径，保留给日志和 Network 排查。
  const endpoint = buildRunStreamEndpoint(threadId);
  // url 是最终 Runtime 地址，Java/Python 切换只改 runtime 参数。
  const url = buildRuntimeUrl(runtime, endpoint);
  // parser 保存 SSE 分片状态，网络分片不一定刚好等于一条事件。
  const parser = new SseTextParser();

  try {
    const response = await fetch(url, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Accept: "text/event-stream"
      },
      body: JSON.stringify(request)
    });

    if (!response.ok || response.body === null) {
      throw createApiError({
        code: response.status === 404 ? "NOT_FOUND" : "SSE_CONNECT_FAILED",
        message: `无法连接智能体流式接口：${endpoint}`,
        status: response.status,
        detail: await response.text()
      });
    }

    handlers.onOpen?.();

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const chunk = decoder.decode(value, { stream: true });

      for (const rawMessage of parser.push(chunk)) {
        handlers.onEvent(parseCampaignSseMessage(rawMessage));
      }
    }

    for (const rawMessage of parser.flush()) {
      handlers.onEvent(parseCampaignSseMessage(rawMessage));
    }
  } catch (error) {
    handlers.onError?.(error instanceof Error ? error : new Error("智能体流式接口发生未知错误"));
  } finally {
    handlers.onClose?.();
  }
}
