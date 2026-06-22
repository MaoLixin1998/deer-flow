import type { RuntimeKind } from "@/shared/config/runtime";
import type { ApiErrorCode } from "@/shared/api/client";

/**
 * SseEventName 是 Phase 1 允许的 SSE 事件名。
 *
 * 来源：
 * - contracts/events/sse-events.md
 * - contracts/events/sse-events.schema.json
 *
 * 改动影响：
 * - Java Runtime、Python Runtime 和前端 reducer 必须同时更新。
 */
export type SseEventName = "run_started" | "message_delta" | "trace_event" | "run_finished" | "run_failed";

/**
 * CampaignSseBaseEvent 是所有 SSE 事件的公共字段。
 *
 * 管理区域：
 * - 运行 ID。
 * - 会话 ID。
 * - Runtime 来源。
 * - 事件创建时间。
 */
export type CampaignSseBaseEvent = {
  /** event 是事件名，必须和 SSE 原始 event 行一致。 */
  event: SseEventName;
  /** runId 是一次 Campaign Run 的唯一标识。 */
  runId: string;
  /** threadId 是会话 ID，用于把事件挂回左侧会话和中间消息。 */
  threadId: string;
  /** runtime 表示事件来自 Java Runtime 还是 Python Runtime。 */
  runtime: RuntimeKind;
  /** createdAt 是事件创建时间，ISO-8601 字符串。 */
  createdAt: string;
};

/**
 * RunStartedEvent 表示后端已经创建运行任务。
 *
 * 页面影响：
 * - 输入框进入运行中状态。
 * - 工作流面板追加“开始运行”节点。
 */
export type RunStartedEvent = CampaignSseBaseEvent & {
  /** event 固定为 run_started。 */
  event: "run_started";
  /** scenario 是业务场景编码，Phase 1 固定为夏季气泡咖啡营销素材。 */
  scenario: "summer_bubble_coffee_campaign";
  /** title 是本次运行标题，页面可以展示在运行状态或 Trace 顶部。 */
  title: string;
};

/**
 * MessageDeltaEvent 表示助手消息的流式增量。
 *
 * 页面影响：
 * - 中间 Agent 回复气泡持续追加 delta。
 */
export type MessageDeltaEvent = CampaignSseBaseEvent & {
  /** event 固定为 message_delta。 */
  event: "message_delta";
  /** delta 是本次新增文本片段，前端要按顺序拼接。 */
  delta: string;
};

/**
 * TraceEventType 是 Phase 1 工作流轨迹事件类型。
 *
 * 页面影响：
 * - 右侧工作流面板根据 type 决定图标、分组和中文说明。
 */
export type TraceEventType =
  | "planner_started"
  | "planner_finished"
  | "model_selected"
  | "tool_call_started"
  | "tool_call_finished"
  | "asset_created"
  | "review_started"
  | "review_finished"
  | "fallback_placeholder";

/**
 * TraceEventStatus 是轨迹事件状态。
 *
 * 页面影响：
 * - pending/running/succeeded/failed 分别对应等待、执行中、成功、失败样式。
 */
export type TraceEventStatus = "pending" | "running" | "succeeded" | "failed";

/**
 * TraceSseEvent 表示 Agent 工作流轨迹事件。
 *
 * 管理区域：
 * - 规划、模型选择、工具调用、资产生成、合规检查、降级占位。
 */
export type TraceSseEvent = CampaignSseBaseEvent & {
  /** event 固定为 trace_event。 */
  event: "trace_event";
  /** eventId 是 Trace 事件 ID，用于列表 key 和父子关联。 */
  eventId: string;
  /** type 是轨迹事件类型。 */
  type: TraceEventType;
  /** title 是中文标题，前端可以直接展示。 */
  title: string;
  /** detail 是中文详情，解释这一步具体做了什么。 */
  detail?: string;
  /** status 是执行状态。 */
  status: TraceEventStatus;
  /** toolName 是工具名，例如 image_mock_generator。 */
  toolName?: string;
  /** assetId 是关联素材 ID，素材生成完成时会携带。 */
  assetId?: string;
  /** parentEventId 是父级 Trace 事件 ID，用于后续折叠树形时间线。 */
  parentEventId?: string;
  /** durationMs 是事件耗时，单位毫秒。 */
  durationMs?: number;
  /** payload 是扩展数据，核心逻辑不能依赖未写进 contracts 的字段。 */
  payload?: Record<string, unknown>;
};

/**
 * RunFinishedEvent 表示本次运行正常完成。
 *
 * 页面影响：
 * - 停止 loading。
 * - 刷新右侧素材面板。
 * - 可生成 AgentOps 运行摘要。
 */
export type RunFinishedEvent = CampaignSseBaseEvent & {
  /** event 固定为 run_finished。 */
  event: "run_finished";
  /** messageId 是最终助手消息 ID。 */
  messageId: string;
  /** assetIds 是本次运行生成的素材 ID 列表。 */
  assetIds: string[];
};

/**
 * RunFailedEvent 表示本次运行失败。
 *
 * 页面影响：
 * - 停止 loading。
 * - 展示中文错误。
 * - 根据 code 决定是否走降级占位。
 */
export type RunFailedEvent = CampaignSseBaseEvent & {
  /** event 固定为 run_failed。 */
  event: "run_failed";
  /** code 是统一错误码。 */
  code: ApiErrorCode;
  /** message 是中文错误提示，前端可直接展示。 */
  message: string;
  /** detail 是开发调试详情，不建议直接展示给用户。 */
  detail?: string;
};

/**
 * CampaignSseEvent 是前端 reducer 接收的完整事件联合类型。
 *
 * 改动影响：
 * - 新增事件后，reducer 必须补 switch 分支。
 */
export type CampaignSseEvent = RunStartedEvent | MessageDeltaEvent | TraceSseEvent | RunFinishedEvent | RunFailedEvent;

/**
 * RawSseMessage 是从 text/event-stream 文本里解析出的原始消息。
 *
 * 管理区域：
 * - SSE parser 和业务事件 validator 之间的桥。
 */
export type RawSseMessage = {
  /** event 是 SSE event 行的值。 */
  event: string;
  /** data 是 SSE data 行合并后的原始字符串。 */
  data: string;
};
