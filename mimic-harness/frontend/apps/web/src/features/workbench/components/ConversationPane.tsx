"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { ComposerBox } from "@/features/workbench/components/ComposerBox";
import { PlanningHat, type PlanStep } from "@/features/workbench/components/PlanningHat";
import { mockMessages } from "@/features/workbench/model/mockData";

/**
 * 中间 Agent 对话区。
 *
 * 管理区域：
 * - 中间消息流。
 * - 输入框上方规划帽子。
 * - 底部创意需求输入框。
 * - 画板模式下对话框收起后的聊天气泡。
 *
 * 接口边界：
 * - Phase 1.7 当前只读取 mockMessages。
 * - 后续提交创意需求会由父级总控接入 POST /api/threads/{threadId}/runs/stream。
 * - 后续消息流会来自 SSE message.delta / run.finished / run.failed。
 *
 * 改动影响：
 * - 改这里的 padding，会影响规划帽子展开时是否把历史对话一起顶上去。
 * - 改收起态返回结构，会影响画板模式下“对话区消失”和“聊天气泡合并到左侧窄栏”的交互。
 */
export function ConversationPane({
  canvasMode,
  brief,
  onBriefChange,
  onSubmit,
  onOpenCanvas,
  canvasChatCollapsed,
  showCollapsedChatButton,
  onToggleCanvasChat
}: {
  /** canvasMode 表示是否处于画板模式，画板模式下会隐藏顶部说明。 */
  canvasMode: boolean;
  /** brief 是当前输入框里的创意需求内容。 */
  brief: string;
  /** onBriefChange 负责把输入框变化同步回父组件状态。 */
  onBriefChange: (value: string) => void;
  /** onSubmit 负责提交创意需求，后续会接流式运行接口。 */
  onSubmit: () => void;
  /** onOpenCanvas 负责打开画板编辑态。 */
  onOpenCanvas: () => void;
  /** canvasChatCollapsed 表示画板模式下对话框是否收起。 */
  canvasChatCollapsed: boolean;
  /** showCollapsedChatButton 表示收起态是否需要在本列展示聊天气泡。 */
  showCollapsedChatButton: boolean;
  /** onToggleCanvasChat 负责在画板模式下展开或收起对话框。 */
  onToggleCanvasChat: () => void;
}) {
  // planOpen 控制输入框上方“规划帽子”是否拉起展示 1-4 步。
  const [planOpen, setPlanOpen] = useState(false);
  // planSteps 是智能体执行链路的待办事项，只在输入框帽子里展示，不再放在消息区。
  const planSteps: PlanStep[] = [
    {
      // title 是阶段标题，页面展示时必须是中文。
      title: "规划",
      // description 用一句话说明这个阶段具体做什么，方便小白理解链路。
      description: "拆解目标人群、卖点、产物和合规要求",
      // done 表示阶段是否完成，完成项展示打钩图标。
      done: true
    },
    {
      // title 是第二阶段标题。
      title: "执行",
      // description 说明执行阶段会调用哪些工具。
      description: "调用生图、分镜、网页和合规检查工具",
      // done=false 表示还没完成，展示一个空框。
      done: false
    },
    {
      // title 是第三阶段标题。
      title: "观察",
      // description 说明观察阶段会读取工具结果和追踪事件。
      description: "读取素材结果、Trace 事件和运行状态",
      // 观察阶段尚未完成。
      done: false
    },
    {
      // title 是第四阶段标题。
      title: "复盘",
      // description 说明复盘阶段会形成最终交付。
      description: "汇总可交付素材、风险提示和下一步建议",
      // 复盘阶段尚未完成。
      done: false
    }
  ];

  if (canvasMode && canvasChatCollapsed) {
    if (!showCollapsedChatButton) {
      /*
       * 左侧列表展开时，收起后的中间对话框必须直接消失。
       *
       * 这里返回一个 0px 列里的空 section：
       * - 不显示气泡。
       * - 不显示按钮。
       * - 不占可见宽度。
       * 用户需要通过左侧会话列表点击某个会话来重新打开。
       */
      return <section className="min-w-0 overflow-hidden bg-panel" />;
    }

    return (
      <section className="relative flex min-w-0 flex-col items-start bg-panel py-3 pl-1.5">
        {/*
         * 只有左侧列表也收起时，这里才显示裸聊天气泡。
         * 因为此时左侧窄栏和对话入口需要合并成一列。
         */}
        <button
          aria-label="展开对话框"
          title="展开对话框"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-ink transition hover:bg-[#f0f0ee]"
          onClick={onToggleCanvasChat}
        >
          <MessageCircle size={18} />
        </button>
      </section>
    );
  }

  return (
    <section className="relative flex min-w-0 flex-col bg-panel">
      <div className="thin-scrollbar min-h-0 flex-1 overflow-auto px-8 py-8 max-md:px-4 max-md:py-5">
        <div className={cn("mx-auto flex min-h-full w-full max-w-3xl flex-col", canvasMode && "max-w-none")}>
          {/* 顶部介绍区已删除：主工作台第一屏应该直接进入对话，不再展示产品说明。 */}
          <div
            className={cn(
              "flex flex-1 flex-col justify-end gap-4 transition-[padding-bottom] duration-300",
              planOpen ? "pb-[23rem]" : "pb-64"
            )}
          >
            {mockMessages.map((message) => (
              <article
                key={message.messageId}
                className={cn(
                  "max-w-[86%] rounded-2xl px-4 py-3 text-sm leading-6",
                  message.role === "user" ? "ml-auto bg-ink text-white" : "mr-auto bg-neutral-50 text-ink"
                )}
              >
                {message.content}
              </article>
            ))}

            {/* 规划卡片已经迁移到输入框上方的“帽子”，这里不再重复展示。 */}
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-panel px-6 pb-5 pt-14">
        <div className="relative mx-auto max-w-4xl max-md:max-w-none">
          {/*
           * 输入框上方的“规划帽子”。
           *
           * 默认只露出第 1 步：01 规划。
           * 点击帽子后向上拉起，展示竖向待办列表。
           * 注意：planOpen 也会增加消息区底部 padding，把上方对话一起顶上去。
           */}
          <PlanningHat open={planOpen} steps={planSteps} onToggle={() => setPlanOpen((value) => !value)} />

          {/* 主输入框：按钮全部收进框内，避免底部散落一排独立按钮。 */}
          <ComposerBox brief={brief} onBriefChange={onBriefChange} onSubmit={onSubmit} onOpenCanvas={onOpenCanvas} />
        </div>
      </div>
    </section>
  );
}
