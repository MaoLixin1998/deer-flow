"use client";

import { Folder, MessageCircle, PanelLeftClose, PanelLeftOpen, Search } from "lucide-react";
import { type PointerEvent as ReactPointerEvent } from "react";
import type { CreativeThread } from "@/entities/conversation/types";
import { cn } from "@/shared/lib/cn";
import { IconButton } from "@/shared/ui/IconButton";

/**
 * ConversationThreadItem 是左侧会话列表需要展示的最小字段。
 *
 * 当前已经从 entities/conversation/types.ts 引入实体类型：
 * - 组件只关心展示字段。
 * - 类型归实体层统一管理。
 * - 后续 GET /api/threads 接口也应返回兼容 CreativeThread 的结构。
 */
export type ConversationThreadItem = CreativeThread;

/**
 * ConversationListPanelProps 描述左侧会话列表从总控层拿到的全部信息。
 *
 * 这类 props 必须写清楚，因为用户是 Java 开发背景：
 * 看到 props 就应该能理解“父组件负责状态，子组件负责展示和局部交互”。
 */
type ConversationListPanelProps = {
  /** open 表示左侧会话列表是否展开。 */
  open: boolean;
  /** canvasMode 表示当前是否处于画板模式。 */
  canvasMode: boolean;
  /** canvasChatCollapsed 表示画板模式下中间对话框是否已经收起。 */
  canvasChatCollapsed: boolean;
  /** leftSidebarWidth 表示左侧会话列表当前像素宽度，拖拽起点依赖它。 */
  leftSidebarWidth: number;
  /** threads 是左侧项目分组下展示的会话列表。 */
  threads: ConversationThreadItem[];
  /** onSetLeftSidebarWidth 负责实时写入拖拽后的左侧会话列表宽度。 */
  onSetLeftSidebarWidth: (width: number) => void;
  /** onToggle 负责展开或收起左侧会话列表。 */
  onToggle: () => void;
  /** onCollapse 只负责把左侧会话列表收成 48px 竖条。 */
  onCollapse: () => void;
  /** onOpenCanvasChat 负责从列表或合并窄栏重新打开画板对话框。 */
  onOpenCanvasChat: () => void;
};

/**
 * ConversationListPanel 是工作台左侧会话列表。
 *
 * 职责边界：
 * - 只负责左侧会话列表展示。
 * - 只负责左侧宽度拖拽的局部交互。
 * - 不负责当前运行状态、右侧面板、SSE、真实接口。
 */
export function ConversationListPanel({
  open,
  canvasMode,
  canvasChatCollapsed,
  leftSidebarWidth,
  threads,
  onSetLeftSidebarWidth,
  onToggle,
  onCollapse,
  onOpenCanvasChat
}: ConversationListPanelProps) {
  /**
   * 开始拖拽左侧会话列表的右边界。
   *
   * 拖拽过程允许一路缩到竖条宽度，但只有松手后低于阈值才正式收起：
   * - 拖动中跟手，不会直接开关。
   * - 松手时小于 collapseWidth，才收成 48px 竖条。
   * - 松手时大于 collapseWidth，则回到可读的最小列表宽度。
   */
  function beginLeftSidebarResize(event: ReactPointerEvent<HTMLDivElement>) {
    // 阻止浏览器默认选中文字，避免拖边界时把会话列表文字刷蓝。
    event.preventDefault();
    // startX 记录用户按下边界时的横坐标。
    const startX = event.clientX;
    // startWidth 记录本次拖拽开始前的左侧列表宽度。
    const startWidth = leftSidebarWidth;
    // collapsedWidth 是左侧竖条宽度，对应总控布局里的 48px。
    const collapsedWidth = 48;
    // collapseWidth 是拖拽松手后触发收起的阈值。
    const collapseWidth = 140;
    // readableMinWidth 是展开态可读的最小宽度，防止文字被压到难看。
    const readableMinWidth = 220;
    // maxWidth 限制左侧最多占屏幕三分之一左右，避免挤掉主对话区。
    const maxWidth = Math.min(420, Math.max(280, Math.floor(window.innerWidth * 0.34)));
    // previousCursor 保存页面原始鼠标样式，拖完以后要恢复。
    const previousCursor = document.body.style.cursor;
    // previousUserSelect 保存页面原始选中文本设置，拖完以后要恢复。
    const previousUserSelect = document.body.style.userSelect;

    // 拖拽期间强制显示列宽拖拽光标，让用户知道当前是在调宽度。
    document.body.style.cursor = "col-resize";
    // 拖拽期间禁用文本选中，保证手感干净。
    document.body.style.userSelect = "none";

    // latestWidth 保存最近一次拖拽宽度，松手时用它判断是否收成竖条。
    let latestWidth = startWidth;

    // handlePointerMove 根据鼠标横向移动距离实时更新左侧列表宽度。
    function handlePointerMove(moveEvent: PointerEvent) {
      // deltaX 大于 0 表示往右拖，列表变宽；小于 0 表示往左拖，列表变窄。
      const deltaX = moveEvent.clientX - startX;
      // nextWidth 是限制在最小/最大范围内的最终展示宽度。
      const nextWidth = Math.min(maxWidth, Math.max(collapsedWidth, startWidth + deltaX));

      // latestWidth 记录最后宽度，cleanup 时决定是否正式收起。
      latestWidth = nextWidth;
      // 写回父组件后，gridTemplateColumns 会用新宽度重新布局。
      onSetLeftSidebarWidth(nextWidth);
    }

    // cleanup 统一清理全局监听和临时样式，避免拖拽结束后页面还保持 col-resize。
    function cleanup() {
      if (latestWidth <= collapseWidth) {
        // 小于收起阈值时，正式切到 48px 竖条态。
        onCollapse();
        // 收起后把记忆宽度恢复为默认值，下一次展开不会变成窄列表。
        onSetLeftSidebarWidth(280);
      } else if (latestWidth < readableMinWidth) {
        // 没到收起阈值但过窄时，自动回弹到可读宽度。
        onSetLeftSidebarWidth(readableMinWidth);
      }

      // 恢复页面光标，避免用户拖完后整页还是列宽拖拽手势。
      document.body.style.cursor = previousCursor;
      // 恢复文本选择策略，避免后续页面文字无法选中。
      document.body.style.userSelect = previousUserSelect;
      // 移除拖拽监听，防止内存泄漏和重复响应。
      window.removeEventListener("pointermove", handlePointerMove);
      // 移除正常松手监听。
      window.removeEventListener("pointerup", cleanup);
      // 移除系统取消监听。
      window.removeEventListener("pointercancel", cleanup);
    }

    // pointermove 监听挂在 window 上，避免鼠标离开边界热区后拖拽中断。
    window.addEventListener("pointermove", handlePointerMove);
    // pointerup 表示拖拽正常结束。
    window.addEventListener("pointerup", cleanup);
    // pointercancel 表示系统取消拖拽，也必须恢复页面状态。
    window.addEventListener("pointercancel", cleanup);
  }

  if (!open) {
    return (
      <aside className="hidden min-w-0 bg-[#fbfbfa] px-1.5 py-3 md:block">
        {/* 收起态只保留展开按钮，避免窄栏里硬塞文字导致拥挤。 */}
        <IconButton label="展开对话列表" className="h-9 w-9 rounded-xl" onClick={onToggle}>
          <PanelLeftOpen size={17} />
        </IconButton>
        {canvasMode && canvasChatCollapsed && (
          /*
           * 列表收起 + 对话收起时，把聊天入口合并到同一条窄栏里。
           *
           * 这里是之前多轮设计确认下来的关键规则：
           * - 不能再让中间对话区自己占一条 44px 竖栏。
           * - 左侧列表窄栏已经存在，所以气泡必须放在这同一列。
           * - 点击气泡只负责恢复画板对话框，不改变左侧列表展开状态。
           */
          <button
            aria-label="展开对话框"
            title="展开对话框"
            className="mt-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-transparent text-ink transition hover:bg-[#f0f0ee]"
            onClick={onOpenCanvasChat}
          >
            <MessageCircle size={18} />
          </button>
        )}
      </aside>
    );
  }

  return (
    <aside className="relative hidden min-w-0 flex-col bg-[#fbfbfa] px-3 py-4 md:flex">
      {/*
       * 左侧列表宽度拖拽热区。
       *
       * 这是一条贴在右边界的透明热区：
       * - 不额外占 grid 列。
       * - 不显示硬边框。
       * - 只在鼠标经过时用浅灰反馈告诉用户可拖拉。
       */}
      <div
        aria-label="拖动调整左侧对话列表宽度"
        title="拖动调整左侧对话列表宽度"
        className="absolute bottom-0 right-0 top-0 z-20 w-3 translate-x-1/2 cursor-col-resize transition hover:bg-[#d8d8d2]/35"
        onPointerDown={beginLeftSidebarResize}
      />

      {/* 顶部操作区：搜索和收起都放在这里，避免额外 header。 */}
      <div className="flex items-center gap-2">
        {/* 搜索区：只保留轻量搜索框，避免左侧一上来就是重边框。 */}
        <div className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-xl bg-[#f0f0ee] px-3 text-sm text-muted">
          <Search size={16} />
          <span>搜索创意会话</span>
        </div>
        {/* 收起按钮：让左侧会话列表可以快速让出空间。 */}
        <IconButton label="收起对话列表" className="h-10 w-10 rounded-xl" onClick={onToggle}>
          <PanelLeftClose size={17} />
        </IconButton>
      </div>

      {/* 置顶会话：用灰色胶囊选中态表达当前会话，不用粗边框。 */}
      <div className="mt-6">
        <div className="px-2 text-xs font-semibold text-[#9b9b9b]">置顶创意</div>
        {/* 列表展开时，如果画板对话框被拖没了，点击任意会话会重新打开对话框。 */}
        <button className="mt-2 flex w-full items-center justify-between rounded-xl bg-[#ececea] px-3 py-2.5 text-left" onClick={onOpenCanvasChat}>
          <span className="text-sm font-medium">夏季气泡咖啡上市</span>
          <span className="text-xs text-muted">当前</span>
        </button>
      </div>

      {/* 项目分组：模拟轻列表风格的信息组织，但文案服务本项目，不照抄任何工具截图。 */}
      <div className="mt-7">
        <div className="px-2 text-xs font-semibold text-[#9b9b9b]">创意项目</div>
        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium">
            <Folder size={17} />
            <span>气泡咖啡首发</span>
          </div>
          {threads.map((thread) => (
            /* 每个会话项都挂 onOpenCanvasChat，保证“点击某个对话再打开”。 */
            <button
              key={thread.threadId}
              onClick={onOpenCanvasChat}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[#f0f0ee]",
                thread.threadId === "thread-summer-coffee" && "bg-[#ececea]"
              )}
            >
              <span className="truncate">{thread.title}</span>
              <span className="ml-3 shrink-0 text-xs text-muted">{thread.updatedAt.split(" ")[0].slice(5)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 最近对话：这里用于后续挂真实 thread 列表。 */}
      <div className="mt-7">
        <div className="px-2 text-xs font-semibold text-[#9b9b9b]">最近对话</div>
        <div className="mt-3 space-y-1">
          {/* 最近对话同样可以作为恢复画板对话框的入口。 */}
          <button className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f0f0ee]" onClick={onOpenCanvasChat}>
            主视觉改文案
          </button>
          {/* 这里保持和上一个按钮同样的恢复逻辑，避免不同列表项行为不一致。 */}
          <button className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-[#f0f0ee]" onClick={onOpenCanvasChat}>
            活动页补优惠券
          </button>
        </div>
      </div>
    </aside>
  );
}
