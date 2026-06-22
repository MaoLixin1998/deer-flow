import type { Message } from "@/entities/message/types";
import type { TraceEvent } from "@/entities/trace/types";
import type { ApiError } from "@/shared/api/client";
import type { CampaignSseEvent, RunFailedEvent, RunFinishedEvent, RunStartedEvent, TraceSseEvent } from "@/shared/sse/events";

/**
 * WorkbenchRunStatus 是工作台当前 Run 的前端状态。
 *
 * 管理区域：
 * - 中间 Agent 对话是否正在生成。
 * - 右侧工作流面板是否还在追加 Trace。
 * - 输入框是否需要禁用发送按钮。
 *
 * 改动影响：
 * - 新增状态时，ComposerBox、工作流面板和错误提示都需要同步适配。
 */
export type WorkbenchRunStatus = "idle" | "running" | "succeeded" | "failed";

/**
 * WorkbenchRunState 是 Phase 1.8 联调前准备的运行态聚合。
 *
 * 管理区域：
 * - 当前运行 ID。
 * - 当前会话 ID。
 * - 中间 Agent 消息列表。
 * - 右侧工作流 Trace 列表。
 * - 本次运行生成的素材 ID。
 * - 中文错误状态。
 *
 * 接口边界：
 * - 输入来自 shared/sse/runStream.ts 解析后的 CampaignSseEvent。
 * - 输出给页面组件渲染，不直接调用后端。
 */
export type WorkbenchRunState = {
  /** status 表示当前运行状态，决定页面 loading、完成、失败展示。 */
  status: WorkbenchRunStatus;
  /** currentRunId 是正在运行或最近完成的 Run ID。 */
  currentRunId?: string;
  /** currentThreadId 是当前会话 ID，用于把消息和 Trace 归回左侧会话。 */
  currentThreadId?: string;
  /** streamingMessageId 是当前流式助手消息的临时 ID。 */
  streamingMessageId?: string;
  /** messages 是中间 Agent 对话列表，后续会来自 GET /api/threads/{threadId}/messages。 */
  messages: Message[];
  /** traceEvents 是右侧工作流轨迹，后续会来自 GET /api/runs/{runId}/trace 或 SSE trace_event。 */
  traceEvents: TraceEvent[];
  /** assetIds 是本次 Run 完成后返回的素材 ID，用于刷新右侧素材面板。 */
  assetIds: string[];
  /** error 保存中文错误对象，页面可以直接展示 message。 */
  error?: ApiError;
};

/**
 * HydrateRunStatePayload 是初始化运行态时注入的 mock 或接口数据。
 *
 * 使用场景：
 * - Phase 1.7 用 mock 数据初始化页面。
 * - Phase 1.8 从 GET /api/threads/{threadId}/messages 和 GET /api/runs/{runId}/trace 恢复历史。
 */
export type HydrateRunStatePayload = {
  /** messages 是会话已有消息。 */
  messages: Message[];
  /** traceEvents 是历史运行轨迹。 */
  traceEvents: TraceEvent[];
};

/**
 * WorkbenchRunAction 是 reducer 接收的动作。
 *
 * 管理区域：
 * - 初始化。
 * - SSE 事件落库到前端状态。
 * - 用户手动重置。
 */
export type WorkbenchRunAction =
  | {
      /** hydrate 表示用 mock 或接口数据初始化运行态。 */
      type: "hydrate";
      /** payload 是初始化消息和 Trace。 */
      payload: HydrateRunStatePayload;
    }
  | {
      /** sse_event 表示收到一条经过 parser 校验的 SSE 业务事件。 */
      type: "sse_event";
      /** event 是 shared/sse/events.ts 定义的事件联合类型。 */
      event: CampaignSseEvent;
    }
  | {
      /** reset 表示用户切换会话或清空当前运行态。 */
      type: "reset";
    };

/**
 * createInitialWorkbenchRunState 创建空运行态。
 *
 * 改动影响：
 * - 默认 status 必须是 idle，避免页面首次打开就进入 loading。
 */
export function createInitialWorkbenchRunState(): WorkbenchRunState {
  return {
    status: "idle",
    messages: [],
    traceEvents: [],
    assetIds: []
  };
}

/**
 * workbenchRunReducer 是工作台 Run 状态的唯一 reducer 草稿。
 *
 * 管理区域：
 * - Phase 1.8 Java/Python Mock SSE 事件落点。
 *
 * 接口边界：
 * - 不直接 fetch。
 * - 不直接改组件 state。
 * - 不处理图片真实上传、RAG、MQ 或数据库持久化。
 */
export function workbenchRunReducer(state: WorkbenchRunState, action: WorkbenchRunAction): WorkbenchRunState {
  switch (action.type) {
    case "hydrate":
      return {
        ...state,
        status: "idle",
        messages: action.payload.messages,
        traceEvents: action.payload.traceEvents,
        assetIds: [],
        error: undefined
      };
    case "sse_event":
      return reduceCampaignSseEvent(state, action.event);
    case "reset":
      return createInitialWorkbenchRunState();
  }
}

/**
 * reduceCampaignSseEvent 把单条 SSE 事件落到前端运行态。
 *
 * 事件映射：
 * - run_started：进入 running，并创建一个空的助手流式消息。
 * - message_delta：追加到当前助手消息。
 * - trace_event：追加或覆盖右侧工作流轨迹。
 * - run_finished：进入 succeeded，并把临时消息 ID 替换成后端最终 messageId。
 * - run_failed：进入 failed，并保存中文错误对象。
 */
export function reduceCampaignSseEvent(state: WorkbenchRunState, event: CampaignSseEvent): WorkbenchRunState {
  switch (event.event) {
    case "run_started":
      return handleRunStarted(state, event);
    case "message_delta":
      return {
        ...state,
        messages: appendAssistantDelta({
          messages: state.messages,
          runId: event.runId,
          threadId: event.threadId,
          streamingMessageId: state.streamingMessageId,
          delta: event.delta,
          createdAt: event.createdAt
        })
      };
    case "trace_event":
      return {
        ...state,
        traceEvents: upsertTraceEvent(state.traceEvents, convertTraceSseEvent(event))
      };
    case "run_finished":
      return handleRunFinished(state, event);
    case "run_failed":
      return handleRunFailed(state, event);
  }
}

/**
 * handleRunStarted 处理 run_started。
 *
 * 页面影响：
 * - 输入框应进入运行中。
 * - 中间区域预留一条 assistant 空消息，用于后续 message_delta 追加。
 */
function handleRunStarted(state: WorkbenchRunState, event: RunStartedEvent): WorkbenchRunState {
  // streamingMessageId 是前端临时 ID，后端 run_finished 返回 messageId 后会替换。
  const streamingMessageId = `streaming-${event.runId}`;
  // streamingMessage 是当前 Run 的助手消息占位。
  const streamingMessage: Message = {
    messageId: streamingMessageId,
    threadId: event.threadId,
    runId: event.runId,
    role: "assistant",
    content: "",
    createdAt: event.createdAt
  };

  return {
    ...state,
    status: "running",
    currentRunId: event.runId,
    currentThreadId: event.threadId,
    streamingMessageId,
    messages: replaceMessageById(state.messages, streamingMessage),
    assetIds: [],
    error: undefined
  };
}

/**
 * appendAssistantDelta 把 message_delta 追加到当前助手消息。
 *
 * 兜底规则：
 * - 如果 run_started 丢失或前端刷新导致 streamingMessageId 不存在，这里会创建一条临时助手消息。
 */
function appendAssistantDelta({
  messages,
  runId,
  threadId,
  streamingMessageId,
  delta,
  createdAt
}: {
  /** messages 是当前页面已有消息列表。 */
  messages: Message[];
  /** runId 是当前 SSE 事件所属 Run。 */
  runId: string;
  /** threadId 是当前 SSE 事件所属会话。 */
  threadId: string;
  /** streamingMessageId 是 run_started 创建的临时助手消息 ID。 */
  streamingMessageId?: string;
  /** delta 是本次追加的文本片段。 */
  delta: string;
  /** createdAt 是事件创建时间。 */
  createdAt: string;
}) {
  // targetMessageId 优先使用 run_started 创建的 ID；没有时用 runId 兜底。
  const targetMessageId = streamingMessageId ?? `streaming-${runId}`;
  // existedMessage 是要追加内容的助手消息。
  const existedMessage = messages.find((message) => message.messageId === targetMessageId);
  // nextMessage 是追加 delta 后的新消息对象。
  const nextMessage: Message = {
    messageId: targetMessageId,
    threadId,
    runId,
    role: "assistant",
    content: `${existedMessage?.content ?? ""}${delta}`,
    createdAt: existedMessage?.createdAt ?? createdAt
  };

  return replaceMessageById(messages, nextMessage);
}

/**
 * convertTraceSseEvent 把 SSE Trace 转成实体层 TraceEvent。
 *
 * 管理区域：
 * - shared/sse/events.ts 与 entities/trace/types.ts 的边界转换。
 *
 * 改动影响：
 * - 如果 contracts 增加 Trace 字段，需要先判断它是否属于页面核心展示，再决定是否同步到实体层。
 */
function convertTraceSseEvent(event: TraceSseEvent): TraceEvent {
  return {
    eventId: event.eventId,
    runId: event.runId,
    threadId: event.threadId,
    runtime: event.runtime,
    type: event.type,
    title: event.title,
    detail: event.detail ?? "",
    status: event.status,
    toolName: event.toolName,
    assetId: event.assetId,
    durationMs: event.durationMs,
    createdAt: event.createdAt
  };
}

/**
 * upsertTraceEvent 追加或覆盖 Trace 事件。
 *
 * 为什么要覆盖：
 * - 后端可能先推 running，再推 succeeded，eventId 相同。
 * - 前端如果直接 push，会出现重复步骤。
 */
function upsertTraceEvent(traceEvents: TraceEvent[], nextTraceEvent: TraceEvent) {
  const existedIndex = traceEvents.findIndex((traceEvent) => traceEvent.eventId === nextTraceEvent.eventId);

  if (existedIndex < 0) {
    return [...traceEvents, nextTraceEvent];
  }

  return traceEvents.map((traceEvent, index) => (index === existedIndex ? nextTraceEvent : traceEvent));
}

/**
 * handleRunFinished 处理 run_finished。
 *
 * 页面影响：
 * - 输入框恢复可提交。
 * - 当前流式消息临时 ID 替换为后端最终 messageId。
 * - assetIds 保存给右侧素材面板刷新使用。
 */
function handleRunFinished(state: WorkbenchRunState, event: RunFinishedEvent): WorkbenchRunState {
  return {
    ...state,
    status: "succeeded",
    currentRunId: event.runId,
    currentThreadId: event.threadId,
    streamingMessageId: undefined,
    assetIds: event.assetIds,
    error: undefined,
    messages: state.streamingMessageId
      ? renameMessageId({
          messages: state.messages,
          fromMessageId: state.streamingMessageId,
          toMessageId: event.messageId
        })
      : state.messages
  };
}

/**
 * handleRunFailed 处理 run_failed。
 *
 * 页面影响：
 * - 输入框恢复可提交。
 * - 页面可以直接展示 error.message。
 * - 后续可按 error.code 决定是否展示降级占位。
 */
function handleRunFailed(state: WorkbenchRunState, event: RunFailedEvent): WorkbenchRunState {
  return {
    ...state,
    status: "failed",
    currentRunId: event.runId,
    currentThreadId: event.threadId,
    streamingMessageId: undefined,
    error: {
      code: event.code,
      message: event.message,
      detail: event.detail
    }
  };
}

/**
 * replaceMessageById 按 messageId 覆盖或追加消息。
 *
 * 管理区域：
 * - 流式助手消息占位。
 * - message_delta 拼接。
 */
function replaceMessageById(messages: Message[], nextMessage: Message) {
  const existed = messages.some((message) => message.messageId === nextMessage.messageId);

  if (!existed) {
    return [...messages, nextMessage];
  }

  return messages.map((message) => (message.messageId === nextMessage.messageId ? nextMessage : message));
}

/**
 * renameMessageId 把前端临时消息 ID 替换为后端最终消息 ID。
 *
 * 改动影响：
 * - 不替换会导致后续刷新消息列表时出现重复 assistant 消息。
 */
function renameMessageId({
  messages,
  fromMessageId,
  toMessageId
}: {
  /** messages 是当前页面已有消息列表。 */
  messages: Message[];
  /** fromMessageId 是前端临时消息 ID。 */
  fromMessageId: string;
  /** toMessageId 是后端最终消息 ID。 */
  toMessageId: string;
}) {
  return messages.map((message) => (message.messageId === fromMessageId ? { ...message, messageId: toMessageId } : message));
}
