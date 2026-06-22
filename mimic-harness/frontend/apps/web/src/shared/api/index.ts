/**
 * shared/api 对外出口。
 *
 * 管理区域：
 * - 普通 HTTP 请求。
 * - OpenAPI 路径常量和动态路径构造函数。
 *
 * 使用规则：
 * - 业务组件只从这里导入 API 工具。
 * - 不允许在组件里手写 Runtime baseUrl。
 */
export * from "@/shared/api/client";
export * from "@/shared/api/endpoints";
