/**
 * CreativeThread 对齐后续 OpenAPI 里的会话线程概念。
 *
 * 管理区域：
 * - 左侧会话列表。
 * - 画板模式下点击会话恢复对话框。
 *
 * 接口边界：
 * - Phase 1.7 当前只使用 mock。
 * - 后续会来自 GET /api/threads。
 *
 * 改动影响：
 * - 改字段名会影响左侧会话列表、消息查询参数和后续后端 contracts 对齐。
 */
export type CreativeThread = {
  /** threadId 是会话唯一 ID，点击会话、拉消息、恢复对话框都会用它。 */
  threadId: string;
  /** title 是会话标题，必须展示中文业务主题。 */
  title: string;
  /** updatedAt 是最近更新时间，当前组件只截取月日展示。 */
  updatedAt: string;
};
