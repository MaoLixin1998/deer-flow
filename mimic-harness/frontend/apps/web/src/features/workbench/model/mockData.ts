/**
 * 工作台 mock 数据统一出口。
 *
 * 管理区域：
 * - 让组件继续从一个稳定入口读取 mock。
 * - 让真实数据类型和 mock 文件分层，不再把所有数据塞进一个大文件。
 *
 * 接口边界：
 * - Phase 1.7 仍然只使用 mock，不调用真实后端。
 * - Phase 1.8 接入 Java/Python Mock SSE 时，可以逐步把这些 mock 替换为 shared/api 与 shared/sse 输出。
 *
 * 改动影响：
 * - 改这里的导出路径会影响所有工作台组件。
 * - 新增 mock 类型时，应优先新建独立 model 文件，再从这里 re-export。
 */
export { mockAssets } from "@/features/workbench/model/assetMock";
export { mockMessages, mockThreads } from "@/features/workbench/model/conversationMock";
export { mockRuntimes } from "@/features/workbench/model/runtimeMock";
export { mockToolCalls } from "@/features/workbench/model/toolMock";
export { mockTraceEvents } from "@/features/workbench/model/traceMock";
