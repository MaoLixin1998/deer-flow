/**
 * ToolCall 对齐 contracts/schemas/tool.schema.json。
 *
 * 管理区域：
 * - 设置页工具调用样例。
 * - 后续 Trace 详情、工具审计和错误定位。
 *
 * 接口边界：
 * - 后续会来自 SSE tool.call.started / tool.call.finished。
 * - input / output 必须脱敏，不能携带密钥、隐私或大体积二进制内容。
 *
 * 改动影响：
 * - 改 status 会影响工具执行状态展示。
 * - 改 input/output 类型会影响后续工具调试面板。
 */
export type ToolCall = {
  /** toolCallId 是工具调用唯一 ID，用于调试和追踪。 */
  toolCallId: string;
  /** runId 表示该工具调用属于哪一次智能体运行。 */
  runId: string;
  /** toolName 是工具名称，页面展示时必须翻译成中文。 */
  toolName: string;
  /** status 是工具执行状态，页面展示时必须映射为中文。 */
  status: "pending" | "running" | "succeeded" | "failed";
  /** input 是工具输入参数，真实接入时必须脱敏。 */
  input: Record<string, unknown>;
  /** output 是工具输出摘要，真实接入时不能包含密钥和隐私。 */
  output: Record<string, unknown>;
  /** durationMs 是工具耗时，单位毫秒。 */
  durationMs: number;
  /** createdAt 是工具调用创建时间。 */
  createdAt: string;
};
