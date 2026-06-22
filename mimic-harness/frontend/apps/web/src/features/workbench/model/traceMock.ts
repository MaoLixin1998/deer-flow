import type { TraceEvent } from "@/entities/trace/types";

/**
 * Trace mock 数据。
 *
 * 管理区域：
 * - 右侧工作流面板。
 * - 后续 AgentOps Trace 时间线。
 *
 * 接口边界：
 * - 字段对齐 contracts/schemas/trace.schema.json。
 * - 后续会来自 SSE trace.appended 事件。
 *
 * 改动影响：
 * - 改 type 会影响前端事件分组和图标。
 * - 改 assetId 会影响 Trace 与素材卡片的联动。
 */
export const mockTraceEvents: TraceEvent[] = [
  {
    // eventId 是轨迹事件唯一 ID。
    eventId: "trace-plan-start",
    // runId 表示这个事件属于哪一次智能体运行。
    runId: "run-summer-coffee-001",
    // threadId 表示这个事件属于哪个会话。
    threadId: "thread-summer-coffee",
    // runtime 表示该事件由 Java 运行时产生。
    runtime: "java",
    // type 是事件类型，前端可根据它选择图标或分组。
    type: "planner_started",
    // title 是页面展示的中文标题。
    title: "规划智能体开始规划",
    // detail 用中文解释规划智能体做了什么。
    detail: "解析创意需求，拆成主视觉、短视频分镜、活动页、合规检查四个子任务。",
    // status 表示事件完成状态，页面会映射成“已完成”。
    status: "succeeded",
    // durationMs 是这一步耗时，单位毫秒。
    durationMs: 320,
    // createdAt 是事件产生时间。
    createdAt: "2026-06-21T10:10:08+08:00"
  },
  {
    // eventId 是模型选择事件唯一 ID。
    eventId: "trace-model",
    // runId 继续关联同一次智能体运行。
    runId: "run-summer-coffee-001",
    // threadId 继续关联同一个创意会话。
    threadId: "thread-summer-coffee",
    // runtime 表示模型选择由 Java 运行时模拟产生。
    runtime: "java",
    // type 为 model_selected 表示发生了模型路由选择。
    type: "model_selected",
    // title 是模型选择步骤的中文展示标题。
    title: "选择模拟多模态模型",
    // detail 说明第一阶段不会真的调用供应商。
    detail: "第一阶段不调用真实供应商，只模拟通义千问、豆包、混元的能力路由。",
    // status 表示模型选择已经完成。
    status: "succeeded",
    // durationMs 记录模型路由选择耗时。
    durationMs: 45,
    // createdAt 是模型选择事件时间。
    createdAt: "2026-06-21T10:10:09+08:00"
  },
  {
    // eventId 是图片素材生成事件唯一 ID。
    eventId: "trace-image",
    // runId 关联当前运行。
    runId: "run-summer-coffee-001",
    // threadId 关联当前会话。
    threadId: "thread-summer-coffee",
    // runtime 表示 Java 运行时产出该事件。
    runtime: "java",
    // type 为 asset_created 表示产出了素材。
    type: "asset_created",
    // title 是素材生成事件标题。
    title: "生成主视觉图片",
    // detail 说明该事件调用了图片生成工具。
    detail: "调用图片生成工具，产出一张可进入画板继续编辑的主视觉。",
    // status 表示图片生成已完成。
    status: "succeeded",
    // toolName 是后端工具名，页面展示时会翻译成中文。
    toolName: "image_generator",
    // assetId 关联右侧素材面板里的主视觉图片。
    assetId: "asset-hero-image",
    // durationMs 是图片生成模拟耗时。
    durationMs: 1680,
    // createdAt 是图片生成事件时间。
    createdAt: "2026-06-21T10:10:12+08:00"
  },
  {
    // eventId 是合规检查事件唯一 ID。
    eventId: "trace-review",
    // runId 关联当前运行。
    runId: "run-summer-coffee-001",
    // threadId 关联当前会话。
    threadId: "thread-summer-coffee",
    // runtime 表示 Java 运行时产出该事件。
    runtime: "java",
    // type 为 review_finished 表示合规检查结束。
    type: "review_finished",
    // title 是合规检查完成的中文标题。
    title: "合规检查完成",
    // detail 说明检查发现的问题和建议。
    detail: "发现轻微夸大表述风险，建议把“爆款必备”改为“夏日推荐”。",
    // status 表示合规检查已完成。
    status: "succeeded",
    // toolName 是合规检查工具的后端名称。
    toolName: "compliance_checker",
    // assetId 关联合规报告素材。
    assetId: "asset-compliance",
    // durationMs 是合规检查模拟耗时。
    durationMs: 510,
    // createdAt 是合规检查完成时间。
    createdAt: "2026-06-21T10:10:15+08:00"
  }
];
