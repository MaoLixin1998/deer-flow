/**
 * shared/sse 对外出口。
 *
 * 管理区域：
 * - SSE 事件类型。
 * - SSE 文本解析。
 * - Campaign Run 流式连接。
 *
 * 使用规则：
 * - feature 层只从这里导入 SSE 能力。
 * - UI 组件不要直接处理 ReadableStream。
 */
export * from "@/shared/sse/events";
export * from "@/shared/sse/parser";
export * from "@/shared/sse/runStream";
