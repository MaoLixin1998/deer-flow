/**
 * CreativeAsset 对齐 contracts/schemas/asset.schema.json。
 *
 * 管理区域：
 * - 右侧素材面板。
 * - 画板默认编辑素材。
 * - HTML 预览面板。
 *
 * 接口边界：
 * - 后续会来自 SSE asset.created 事件。
 * - 历史运行恢复时会来自 GET /api/runs/{runId}/assets。
 *
 * 改动影响：
 * - 改 type 会影响素材中文标签、面板分类和画板入口判断。
 * - 改 htmlSnippet 会影响 HTML 预览渲染方式，真实接入时必须隔离渲染。
 */
export type CreativeAsset = {
  /** assetId 是素材唯一 ID，用于素材预览、画板编辑和导出。 */
  assetId: string;
  /** runId 表示这个素材由哪一次智能体运行生成。 */
  runId: string;
  /** type 是素材类型，页面展示时必须翻译成中文。 */
  type: "image" | "video_storyboard" | "html" | "compliance_report";
  /** title 是素材标题，显示在右侧素材面板第一行。 */
  title: string;
  /** description 是素材说明，用来解释素材用途和后续可操作能力。 */
  description: string;
  /** status 是素材生成状态，页面展示时必须映射为中文状态。 */
  status: "pending" | "running" | "succeeded" | "failed";
  /** previewUrl 是预览地址，Phase 1 可以是 mock 占位地址。 */
  previewUrl?: string;
  /** htmlSnippet 是网页素材片段，只在 type 为 html 时使用。 */
  htmlSnippet?: string;
  /** createdAt 是素材生成时间，后续可用于排序和审计。 */
  createdAt: string;
};
