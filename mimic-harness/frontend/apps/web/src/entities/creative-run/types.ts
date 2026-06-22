/**
 * creative-run 旧实体聚合出口。
 *
 * 管理区域：
 * - 保持旧 import 路径兼容，避免组件和 mock 文件一次性大面积改动。
 *
 * 接口边界：
 * - 新代码应优先从 entities/message、entities/asset、entities/trace、entities/tool 引入。
 * - 这个文件后续可以在完成全量迁移后删除。
 *
 * 改动影响：
 * - 删除这里会影响仍从 "@/entities/creative-run/types" 引入的旧代码。
 */
export type { CreativeAsset } from "@/entities/asset/types";
export type { Message } from "@/entities/message/types";
export type { ToolCall } from "@/entities/tool/types";
export type { TraceEvent } from "@/entities/trace/types";
