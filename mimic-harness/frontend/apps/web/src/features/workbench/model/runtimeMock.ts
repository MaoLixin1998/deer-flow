import { RUNTIME_BASE_URL } from "@/shared/config/runtime";
import type { RuntimeInfo } from "@/entities/runtime/types";

/**
 * Runtime mock 数据。
 *
 * 管理区域：
 * - 设置页 Runtime 列表。
 * - 工作台提交创意需求时的 selectedRuntime 占位。
 *
 * 接口边界：
 * - 字段必须对齐 contracts/schemas/runtime.schema.json。
 * - 后续会来自 GET /api/runtimes。
 *
 * 改动影响：
 * - 改 runtime 会影响 Java/Python 双运行时路由。
 * - 改 status 会影响页面是否展示“可用 / 降级 / 离线”。
 */
export const mockRuntimes: RuntimeInfo[] = [
  {
    // runtime 表示运行时类型，前端用它区分 Java 后端和 Python 后端。
    runtime: "java",
    // serviceName 是设置页展示名，页面要求全中文，所以不直接展示技术英文名。
    serviceName: "主创意智能体运行时",
    // status 表示服务健康状态，online 会在页面展示为“可用”。
    status: "online",
    // baseUrl 是后端基础地址，Phase 1 只展示，后续联调会真实请求。
    baseUrl: RUNTIME_BASE_URL.java,
    // mockMode 为 true 表示当前绝不调用真实模型，避免误产生费用。
    mockMode: true,
    // message 是中文状态提示，页面可以直接展示给用户。
    message: "Java 模拟运行时可用，当前只返回演示数据。"
  },
  {
    // runtime 为 python 表示这条记录对应 Python 后端实现。
    runtime: "python",
    // serviceName 是备用运行时的中文展示名，具体技术栈通过 runtime 字段区分。
    serviceName: "备用创意智能体运行时",
    // status 设为 degraded 是为了演示“降级可用”的工程能力。
    status: "degraded",
    // baseUrl 是 Python 服务默认本地地址。
    baseUrl: RUNTIME_BASE_URL.python,
    // mockMode 保持 true，说明这里只是模拟运行时。
    mockMode: true,
    // message 用中文解释为什么它是降级状态。
    message: "Python 模拟运行时可用，但模拟为降级模式。"
  }
];
