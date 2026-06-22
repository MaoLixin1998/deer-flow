/**
 * API endpoint 总控文件。
 *
 * 管理区域：
 * - 前端所有后端接口路径。
 * - contracts/openapi/agent-api.yaml 中已经冻结的 Phase 1 路径。
 *
 * 接口边界：
 * - 这里只拼 path，不拼 baseUrl。
 * - baseUrl 由 shared/config/runtime.ts 根据 Java / Python Runtime 决定。
 *
 * 改动影响：
 * - 改这里会影响所有真实接口调用。
 * - 如果 contracts/openapi/agent-api.yaml 路径变化，必须先改 contracts，再改本文件。
 */

/**
 * API_ENDPOINTS 保存不带动态参数的接口路径。
 *
 * 注意：
 * - 这里的 key 给前端代码读，使用英文是代码标识。
 * - value 必须严格对齐 OpenAPI paths。
 */
export const API_ENDPOINTS = {
  /** health 是 Runtime 健康检查接口，用于判断 Java/Python 服务是否可用。 */
  health: "/api/health",
  /** runtimes 是 Runtime 列表接口，用于设置页展示双语言运行时状态。 */
  runtimes: "/api/runtimes",
  /** models 是模型列表接口，用于后续展示可用模型和降级链路。 */
  models: "/api/models",
  /** threads 是会话列表接口，用于左侧对话列表。 */
  threads: "/api/threads",
  /** runs 是运行列表接口，用于后续 AgentOps 运行记录。 */
  runs: "/api/runs",
  /** assets 是素材列表接口，用于右侧素材面板和画板素材选择。 */
  assets: "/api/assets"
} as const;

/**
 * buildRuntimeEndpoint 拼接单个 Runtime 详情接口。
 *
 * 接口路径：
 * - GET /api/runtimes/{runtime}
 *
 * 改动影响：
 * - runtime 只能是 java 或 python，否则后端会返回 INVALID_RUNTIME。
 */
export function buildRuntimeEndpoint(runtime: string) {
  return `/api/runtimes/${encodeURIComponent(runtime)}`;
}

/**
 * buildThreadEndpoint 拼接会话详情接口。
 *
 * 接口路径：
 * - GET /api/threads/{threadId}
 *
 * 改动影响：
 * - threadId 必须来自后端或 mock 数据，不能用页面标题代替。
 */
export function buildThreadEndpoint(threadId: string) {
  return `/api/threads/${encodeURIComponent(threadId)}`;
}

/**
 * buildThreadMessagesEndpoint 拼接会话消息接口。
 *
 * 接口路径：
 * - GET /api/threads/{threadId}/messages
 *
 * 管理区域：
 * - 中间 Agent 对话历史。
 */
export function buildThreadMessagesEndpoint(threadId: string) {
  return `${buildThreadEndpoint(threadId)}/messages`;
}

/**
 * buildRunStreamEndpoint 拼接创建 Run 并返回 SSE 的接口。
 *
 * 接口路径：
 * - POST /api/threads/{threadId}/runs/stream
 *
 * 管理区域：
 * - 用户点击发送按钮后的 Agent 主链路。
 * - 后续 Java / Python Runtime 都必须实现同一个路径。
 */
export function buildRunStreamEndpoint(threadId: string) {
  return `${buildThreadEndpoint(threadId)}/runs/stream`;
}

/**
 * buildRunEndpoint 拼接单个 Run 详情接口。
 *
 * 接口路径：
 * - GET /api/runs/{runId}
 *
 * 管理区域：
 * - 后续运行详情页或 AgentOps 回放页。
 */
export function buildRunEndpoint(runId: string) {
  return `/api/runs/${encodeURIComponent(runId)}`;
}

/**
 * buildRunTraceEndpoint 拼接 Run Trace 查询接口。
 *
 * 接口路径：
 * - GET /api/runs/{runId}/trace
 *
 * 管理区域：
 * - 工作流轨迹面板。
 * - 后续 AgentOps 时间线。
 */
export function buildRunTraceEndpoint(runId: string) {
  return `${buildRunEndpoint(runId)}/trace`;
}
