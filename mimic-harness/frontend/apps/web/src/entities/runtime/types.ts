import type { RuntimeKind } from "@/shared/config/runtime";

export type RuntimeStatus = "online" | "offline" | "degraded";

/**
 * RuntimeInfo 对齐 contracts/schemas/runtime.schema.json。
 *
 * Java 和 Python Runtime 必须输出同构结构，前端才能无感切换。
 */
export type RuntimeInfo = {
  /** runtime 表示后端实现语言，前端用它决定请求 Java 还是 Python 服务。 */
  runtime: RuntimeKind;
  /** serviceName 是页面展示名，只给用户看，不参与接口路由判断。 */
  serviceName: string;
  /** status 表示运行时健康状态，前端用它展示可用、离线、降级可用。 */
  status: RuntimeStatus;
  /** baseUrl 是运行时基础地址，Phase 1 用于设置页展示和后续联调。 */
  baseUrl: string;
  /** mockMode 表示是否模拟模式，true 时不能调用真实模型供应商。 */
  mockMode: boolean;
  /** message 是中文状态说明，前端可以直接展示给用户。 */
  message: string;
};
