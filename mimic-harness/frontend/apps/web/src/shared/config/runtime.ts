/**
 * Runtime 基础地址只放在 shared/config。
 *
 * UI 组件不能直接拼后端 URL，否则后续 Java/Python 切换、环境变量和网关代理都会变得混乱。
 */
export const RUNTIME_BASE_URL = {
  java: "http://localhost:8080",
  python: "http://localhost:8000"
} as const;

export type RuntimeKind = keyof typeof RUNTIME_BASE_URL;
