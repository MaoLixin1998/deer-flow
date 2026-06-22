import type { ToolCall } from "@/entities/tool/types";

/**
 * 工具调用 mock 数据。
 *
 * 管理区域：
 * - 设置页工具调用示例。
 * - 后续 Trace 详情抽屉。
 *
 * 接口边界：
 * - 字段对齐 contracts/schemas/tool.schema.json。
 * - 后续会来自 SSE tool.call.started / tool.call.finished 事件。
 *
 * 改动影响：
 * - input/output 只能放脱敏摘要，不能放真实 API Key 或用户隐私。
 */
export const mockToolCalls: ToolCall[] = [
  {
    // toolCallId 是图片生成工具调用唯一 ID。
    toolCallId: "tool-image-001",
    // runId 表示这次工具调用属于当前智能体运行。
    runId: "run-summer-coffee-001",
    // toolName 是后端工具名，页面会翻译成中文。
    toolName: "image_generator",
    // status 表示工具调用已完成。
    status: "succeeded",
    // input 是工具输入参数，真实接入时必须脱敏。
    input: { scene: "夏季气泡咖啡", ratio: "4:5", style: "干净明亮" },
    // output 是工具输出摘要，当前只记录素材 ID 和是否可编辑。
    output: { assetId: "asset-hero-image", editable: true },
    // durationMs 是工具模拟耗时。
    durationMs: 1680,
    // createdAt 是工具调用创建时间。
    createdAt: "2026-06-21T10:10:12+08:00"
  },
  {
    // toolCallId 是网页生成工具调用唯一 ID。
    toolCallId: "tool-html-001",
    // runId 表示这次工具调用属于当前智能体运行。
    runId: "run-summer-coffee-001",
    // toolName 是网页生成工具的后端名称。
    toolName: "html_builder",
    // status 表示网页生成已完成。
    status: "succeeded",
    // input 是网页生成工具输入参数。
    input: { sectionCount: 4, target: "移动端活动页" },
    // output 是网页生成输出摘要，previewReady 表示可预览。
    output: { assetId: "asset-html", previewReady: true },
    // durationMs 是网页生成模拟耗时。
    durationMs: 920,
    // createdAt 是工具调用创建时间。
    createdAt: "2026-06-21T10:10:14+08:00"
  }
];
