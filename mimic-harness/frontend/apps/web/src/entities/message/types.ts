/**
 * Message 对齐 contracts/schemas/message.schema.json。
 *
 * 管理区域：
 * - 中间 Agent 对话气泡。
 * - 后续 SSE message.delta 合并后的消息列表。
 *
 * 接口边界：
 * - 后续会来自 GET /api/threads/{threadId}/messages。
 * - 流式生成时会由 SSE message.delta 增量更新 content。
 *
 * 改动影响：
 * - 改 role 会影响气泡左右位置和样式。
 * - 改 threadId / runId 会影响会话、运行、Trace 三者关联。
 */
export type Message = {
  /** messageId 是消息唯一 ID，前端列表渲染 key 和后端追踪都依赖它。 */
  messageId: string;
  /** threadId 是会话 ID，用来把多条消息归到同一个创意会话里。 */
  threadId: string;
  /** runId 是关联运行 ID，用户消息可以为空，智能体消息通常会关联一次运行。 */
  runId?: string;
  /** role 表示消息来源，前端用它决定气泡样式和左右位置。 */
  role: "user" | "assistant" | "system" | "tool";
  /** content 是消息正文，页面会直接展示，后续也会作为上下文输入。 */
  content: string;
  /** createdAt 是消息创建时间，后续用于排序和时间展示。 */
  createdAt: string;
};
