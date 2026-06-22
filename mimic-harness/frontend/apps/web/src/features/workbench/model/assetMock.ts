import type { CreativeAsset } from "@/entities/asset/types";

/**
 * 素材 mock 数据。
 *
 * 管理区域：
 * - 右侧素材面板。
 * - 画板默认编辑素材标题。
 * - HTML 预览面板。
 *
 * 接口边界：
 * - 字段对齐 contracts/schemas/asset.schema.json。
 * - 后续会来自 SSE asset.created 事件和 GET /api/runs/{runId}/assets。
 *
 * 改动影响：
 * - 改 type 会影响素材中文标签和面板分类。
 * - 改 title 会影响画板默认标题。
 */
export const mockAssets: CreativeAsset[] = [
  {
    // assetId 是主视觉图片素材唯一 ID。
    assetId: "asset-hero-image",
    // runId 表示素材来自当前智能体运行。
    runId: "run-summer-coffee-001",
    // type 表示素材类型为图片。
    type: "image",
    // title 是素材卡片标题。
    title: "夏季气泡咖啡主视觉",
    // description 说明素材可以进入画板继续编辑。
    description: "可进入画板继续裁剪、局部重绘和加文案。",
    // status 表示素材已生成完成。
    status: "succeeded",
    // previewUrl 是模拟预览地址，Phase 1 不加载真实图片。
    previewUrl: "mock://summer-coffee-hero",
    // createdAt 是素材创建时间。
    createdAt: "2026-06-21T10:10:12+08:00"
  },
  {
    // assetId 是短视频分镜素材唯一 ID。
    assetId: "asset-video-board",
    // runId 表示素材来自当前智能体运行。
    runId: "run-summer-coffee-001",
    // type 表示素材类型为短视频分镜。
    type: "video_storyboard",
    // title 是短视频分镜卡片标题。
    title: "15 秒短视频分镜",
    // description 说明分镜内容。
    description: "开场冰块声、倒入气泡、杯壁水珠、结尾促销口播。",
    // status 表示素材已生成完成。
    status: "succeeded",
    // previewUrl 是模拟分镜预览地址。
    previewUrl: "mock://summer-coffee-video-board",
    // createdAt 是素材创建时间。
    createdAt: "2026-06-21T10:10:13+08:00"
  },
  {
    // assetId 是网页素材唯一 ID。
    assetId: "asset-html",
    // runId 表示素材来自当前智能体运行。
    runId: "run-summer-coffee-001",
    // type 表示素材类型为网页片段。
    type: "html",
    // title 是网页素材标题。
    title: "移动端活动页",
    // description 说明网页包含哪些结构。
    description: "包含首屏、卖点、门店券、购买按钮四段结构。",
    // status 表示网页素材已生成完成。
    status: "succeeded",
    // htmlSnippet 是模拟网页片段，后续真实预览必须隔离渲染。
    htmlSnippet: "<section><h1>夏日气泡咖啡</h1><p>清爽上市</p></section>",
    // createdAt 是素材创建时间。
    createdAt: "2026-06-21T10:10:14+08:00"
  },
  {
    // assetId 是合规报告素材唯一 ID。
    assetId: "asset-compliance",
    // runId 表示报告来自当前智能体运行。
    runId: "run-summer-coffee-001",
    // type 表示素材类型为合规报告。
    type: "compliance_report",
    // title 是合规报告标题。
    title: "合规检查报告",
    // description 是合规结论摘要。
    description: "整体通过，建议替换一处营销夸张词。",
    // status 表示合规报告已生成完成。
    status: "succeeded",
    // createdAt 是素材创建时间。
    createdAt: "2026-06-21T10:10:15+08:00"
  }
];
