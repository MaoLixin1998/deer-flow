import type { CreativeThread } from "@/entities/conversation/types";
import type { Message } from "@/entities/message/types";

/**
 * 会话列表 mock。
 *
 * 管理区域：
 * - 左侧会话列表。
 * - 画板模式下点击会话恢复对话框。
 *
 * 接口边界：
 * - Phase 1.7 当前只使用 mock。
 * - 后续会来自 GET /api/threads。
 *
 * 改动影响：
 * - 改 threadId 会影响消息 mock 的 threadId 关联。
 * - 改 updatedAt 会影响左侧列表日期展示。
 */
export const mockThreads: CreativeThread[] = [
  {
    // threadId 是会话唯一 ID，后续请求消息列表会用它。
    threadId: "thread-summer-coffee",
    // title 是会话标题，展示在左侧会话抽屉。
    title: "夏季气泡咖啡上市",
    // updatedAt 是最近更新时间，帮助用户判断会话新旧。
    updatedAt: "2026-06-21 10:12"
  },
  {
    // threadId 用于区分落地页生成这条会话。
    threadId: "thread-html-campaign",
    // title 用中文表达这条会话的业务主题。
    title: "新品落地页生成",
    // updatedAt 是这条会话最后更新时间。
    updatedAt: "2026-06-20 22:35"
  },
  {
    // threadId 用于区分短视频分镜这条会话。
    threadId: "thread-video-board",
    // title 展示短视频分镜草案这个任务。
    title: "短视频分镜草案",
    // updatedAt 是该会话最后更新时间。
    updatedAt: "2026-06-20 18:02"
  }
];

/**
 * 消息 mock 数据。
 *
 * 管理区域：
 * - 中间 Agent 对话气泡。
 *
 * 接口边界：
 * - 字段对齐 contracts/schemas/message.schema.json。
 * - 后续会来自 GET /api/threads/{threadId}/messages。
 * - assistant 消息携带 runId，用于把“对话内容”和“一次 Agent 运行”串起来。
 *
 * 改动影响：
 * - 改 role 会影响左右气泡样式。
 * - 改 threadId 会影响与会话列表的关联。
 */
export const mockMessages: Message[] = [
  {
    // messageId 是用户消息唯一 ID。
    messageId: "msg-user-1",
    // threadId 表示这条消息属于夏季气泡咖啡会话。
    threadId: "thread-summer-coffee",
    // role 为 user 表示这是用户输入。
    role: "user",
    // content 是用户真实看到的消息正文。
    content: "帮我为夏季气泡咖啡生成一套小红书首发素材：主视觉、短视频分镜、活动页和合规检查。",
    // createdAt 是消息创建时间，后续排序会使用。
    createdAt: "2026-06-21T10:10:00+08:00"
  },
  {
    // messageId 是智能体回复消息唯一 ID。
    messageId: "msg-agent-1",
    // threadId 继续挂在同一个创意会话下。
    threadId: "thread-summer-coffee",
    // runId 表示这条回复来自一次智能体运行。
    runId: "run-summer-coffee-001",
    // role 为 assistant 表示这是智能体输出。
    role: "assistant",
    // content 用中文说明智能体接下来会做哪些动作。
    content: "我会先拆解目标人群和卖点，再调用生图、分镜、活动页和合规检查工具，最后把可交付素材放到右侧能力面板。",
    // createdAt 是智能体回复时间。
    createdAt: "2026-06-21T10:10:08+08:00"
  }
];
