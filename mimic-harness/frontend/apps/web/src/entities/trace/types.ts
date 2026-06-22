import type { RuntimeKind } from "@/shared/config/runtime";

/**
 * TraceEvent 对齐 contracts/schemas/trace.schema.json。
 *
 * 管理区域：
 * - 右侧工作流面板。
 * - 后续 AgentOps Trace 时间线和运行回放。
 *
 * 接口边界：
 * - 后续会来自 SSE trace.appended。
 * - runtime 必须和 Java/Python 双后端运行时一致。
 *
 * 改动影响：
 * - 改 type 会影响事件分组、图标和 reducer 合并逻辑。
 * - 改 assetId 会影响 Trace 与素材卡片联动。
 */
export type TraceEvent = {
  /** eventId 是轨迹事件 ID，用于时间线渲染 key。 */
  eventId: string;
  /** runId 表示该轨迹属于哪一次智能体运行。 */
  runId: string;
  /** threadId 表示该轨迹属于哪个会话。 */
  threadId: string;
  /** runtime 表示事件由 Java 还是 Python 运行时产生。 */
  runtime: RuntimeKind;
  /** type 是轨迹事件类型，前端可根据它选择图标和分组。 */
  type:
    | "planner_started"
    | "planner_finished"
    | "model_selected"
    | "tool_call_started"
    | "tool_call_finished"
    | "asset_created"
    | "review_started"
    | "review_finished"
    | "fallback_placeholder";
  /** title 是中文事件标题，直接展示在工作流面板。 */
  title: string;
  /** detail 是中文事件详情，用于解释这一步做了什么。 */
  detail: string;
  /** status 是事件状态，页面展示时必须映射为中文。 */
  status: "pending" | "running" | "succeeded" | "failed";
  /** toolName 是关联工具名称，例如图片生成工具或网页生成工具。 */
  toolName?: string;
  /** assetId 是关联素材 ID，素材生成事件会携带它。 */
  assetId?: string;
  /** durationMs 是事件耗时，单位毫秒，用于后续性能分析。 */
  durationMs?: number;
  /** createdAt 是事件创建时间，用于时间线排序。 */
  createdAt: string;
};
