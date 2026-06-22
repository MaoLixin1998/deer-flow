import type { RuntimeKind } from "@/shared/config/runtime";
import { RUNTIME_BASE_URL } from "@/shared/config/runtime";

/**
 * ApiErrorCode 是前端识别的统一错误码。
 *
 * 来源：
 * - contracts/schemas/error.schema.json
 * - contracts/events/sse-events.schema.json
 *
 * 改动影响：
 * - 新增后端错误码时，必须同步更新这里，否则前端无法稳定分流错误展示。
 */
export type ApiErrorCode =
  | "RUNTIME_UNAVAILABLE"
  | "SSE_CONNECT_FAILED"
  | "SSE_STREAM_INTERRUPTED"
  | "RUN_FAILED"
  | "INVALID_REQUEST"
  | "INVALID_RUNTIME"
  | "UNKNOWN_EVENT_TYPE"
  | "INVALID_ASSET_PAYLOAD"
  | "EMPTY_HTML_PREVIEW"
  | "NOT_FOUND";

/**
 * ApiError 是前端统一错误对象。
 *
 * 管理区域：
 * - HTTP 请求失败。
 * - SSE 连接失败。
 * - JSON 解析失败。
 *
 * 展示规则：
 * - message 必须是中文，可直接展示给用户。
 */
export type ApiError = {
  /** code 是机器可读错误码，用于页面选择降级策略。 */
  code: ApiErrorCode;
  /** message 是中文错误提示，用于 toast、面板错误态或日志。 */
  message: string;
  /** status 是 HTTP 状态码；网络错误或本地解析错误可以为空。 */
  status?: number;
  /** detail 是调试详情，只给开发者日志使用，不建议直接展示给用户。 */
  detail?: string;
};

/**
 * ApiRequestOptions 是 requestJson 的最小请求配置。
 *
 * 管理区域：
 * - 普通 JSON HTTP 请求。
 *
 * 接口边界：
 * - SSE 流式接口不要走 requestJson，要走 shared/sse/runStream.ts。
 */
export type ApiRequestOptions = {
  /** runtime 决定请求 Java Runtime 还是 Python Runtime。 */
  runtime: RuntimeKind;
  /** path 是 OpenAPI 中的接口路径，例如 /api/runtimes。 */
  path: string;
  /** method 是 HTTP 方法，默认 GET。 */
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  /** body 是请求体对象，requestJson 会自动转成 JSON 字符串。 */
  body?: unknown;
  /** signal 用于取消请求，例如页面切换或用户停止运行。 */
  signal?: AbortSignal;
};

/**
 * createApiError 创建统一错误对象。
 *
 * 改动影响：
 * - 这里的中文文案会影响所有未被业务单独处理的错误展示。
 */
export function createApiError(error: ApiError) {
  return error;
}

/**
 * buildRuntimeUrl 拼接 Runtime 完整 URL。
 *
 * 管理区域：
 * - Java Runtime: http://localhost:8080
 * - Python Runtime: http://localhost:8000
 *
 * 改动影响：
 * - 前端不要在组件中手动拼 baseUrl。
 * - 后续如果改成网关代理，只需要改 shared/config/runtime.ts。
 */
export function buildRuntimeUrl(runtime: RuntimeKind, path: string) {
  // baseUrl 来自统一 Runtime 配置，保证 Java/Python 双实现入口一致。
  const baseUrl = RUNTIME_BASE_URL[runtime];
  // URL 构造器可以正确处理 path 的前导斜杠，避免出现双斜杠。
  return new URL(path, baseUrl).toString();
}

/**
 * requestJson 是普通 JSON 接口请求壳。
 *
 * 管理区域：
 * - GET /api/runtimes
 * - GET /api/models
 * - GET /api/threads
 * - GET /api/assets
 *
 * 接口边界：
 * - 不负责 SSE。
 * - 不负责 React 状态更新。
 * - 不吞掉错误，调用方必须决定如何展示或降级。
 */
export async function requestJson<ResponseBody>({
  runtime,
  path,
  method = "GET",
  body,
  signal
}: ApiRequestOptions): Promise<ResponseBody> {
  // url 是最终请求地址，后续联调时可在浏览器 Network 面板直接看到。
  const url = buildRuntimeUrl(runtime, path);
  // response 是 fetch 原始响应，先检查 HTTP 状态，再解析 JSON。
  const response = await fetch(url, {
    method,
    signal,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  if (!response.ok) {
    throw createApiError({
      code: response.status === 404 ? "NOT_FOUND" : "INVALID_REQUEST",
      message: `接口请求失败：${method} ${path}`,
      status: response.status,
      detail: await response.text()
    });
  }

  return response.json() as Promise<ResponseBody>;
}
