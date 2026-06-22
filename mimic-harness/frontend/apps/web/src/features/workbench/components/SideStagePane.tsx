"use client";

import { type PointerEvent as ReactPointerEvent } from "react";
import { cn } from "@/shared/lib/cn";
import { CanvasPane } from "@/features/workbench/components/CanvasPane";
import { RightCapabilityPanel, type RightPanel } from "@/features/workbench/components/RightCapabilityPanel";

/**
 * 右侧舞台区。
 *
 * 管理区域：
 * - 普通右侧产品能力面板。
 * - 画板编辑层。
 * - 普通右侧面板宽度拖拽热区。
 * - 画板模式下对话区和画板之间的拖拽热区。
 *
 * 接口边界：
 * - Phase 1.7 只接收父级传入的 mock 状态，不直接调用接口。
 * - 普通右侧能力数据由 RightCapabilityPanel 读取 mock。
 * - 画板内部未来接口由 CanvasPane 承担。
 *
 * 改动影响：
 * - 改这里的拖拽阈值，会影响右侧面板是否容易收成 48px 竖条。
 * - 改这里的过渡时间，会影响画板是否像“跳出来”。
 * - 改这里的层级和绝对定位，会影响普通面板和画板层切换是否互相盖住。
 */
export function SideStagePane({
  canvasMode,
  rightOpen,
  activePanel,
  assetTitle,
  onOpenPanel,
  onCloseRight,
  onExitCanvas,
  showCanvasVoiceButton,
  canvasChatCollapsed,
  onSetCanvasChatCollapsed,
  canvasChatWidth,
  onSetCanvasChatWidth,
  rightPanelWidth,
  onSetRightPanelWidth,
  motionDurationMs
}: {
  /** canvasMode 表示当前是否进入画板编辑态。 */
  canvasMode: boolean;
  /** rightOpen 表示普通右侧产品能力详情是否展开。 */
  rightOpen: boolean;
  /** activePanel 是普通右侧面板当前能力。 */
  activePanel: RightPanel;
  /** assetTitle 是画板当前编辑素材标题。 */
  assetTitle: string;
  /** onOpenPanel 负责切换普通能力或进入画板。 */
  onOpenPanel: (panel: RightPanel) => void;
  /** onCloseRight 负责收起普通右侧详情。 */
  onCloseRight: () => void;
  /** onExitCanvas 负责退出画板，回到素材面板。 */
  onExitCanvas: () => void;
  /** showCanvasVoiceButton 表示是否展示画板内部语音按钮。 */
  showCanvasVoiceButton: boolean;
  /** canvasChatCollapsed 表示画板模式下左侧对话区是否已经收起。 */
  canvasChatCollapsed: boolean;
  /** onSetCanvasChatCollapsed 负责根据拖拽结果设置对话区收起状态。 */
  onSetCanvasChatCollapsed: (collapsed: boolean) => void;
  /** canvasChatWidth 是画板模式下对话区当前像素宽度。 */
  canvasChatWidth: number;
  /** onSetCanvasChatWidth 负责实时更新拖拽后的对话区宽度。 */
  onSetCanvasChatWidth: (width: number) => void;
  /** rightPanelWidth 是普通右侧功能面板当前像素宽度。 */
  rightPanelWidth: number;
  /** onSetRightPanelWidth 负责实时更新拖拽后的右侧功能面板宽度。 */
  onSetRightPanelWidth: (width: number) => void;
  /** motionDurationMs 是右侧推拉动画时长，由父组件按实际展开宽度计算。 */
  motionDurationMs: number;
}) {
  /**
   * 开始拖拽普通右侧功能面板的左边界。
   *
   * 这里和画板拖拽分开处理：
   * - 普通态拖的是“功能面板”宽度。
   * - 画板态拖的是“对话区”宽度。
   * - 普通态拖到很窄后松手，会收成 48px 工具竖条。
   * 两者不能共用一个状态，否则会出现边界行为互相污染。
   */
  function beginRightPanelResize(event: ReactPointerEvent<HTMLDivElement>) {
    // 阻止默认选择文本行为，保证拖拽过程干净。
    event.preventDefault();
    // startX 记录用户按下右侧功能面板左边界时的横坐标。
    const startX = event.clientX;
    // startWidth 记录拖拽开始前右侧功能面板宽度。
    const startWidth = rightPanelWidth;
    // collapsedWidth 是右侧工具竖条宽度，对应总控文件 layoutTemplate 里的 48px。
    const collapsedWidth = 48;
    // collapseWidth 是右侧功能面板触发竖条收起的松手阈值。
    const collapseWidth = 180;
    // readableMinWidth 是右侧能力详情可读的最小宽度。
    const readableMinWidth = 300;
    // maxWidth 限制右侧面板最大宽度，避免把中间对话区压得太狠。
    const maxWidth = Math.min(560, Math.max(360, Math.floor(window.innerWidth * 0.42)));
    // previousCursor 保存原始鼠标样式，拖拽结束后恢复。
    const previousCursor = document.body.style.cursor;
    // previousUserSelect 保存原始文本选中策略，拖拽结束后恢复。
    const previousUserSelect = document.body.style.userSelect;

    // 拖右侧左边界时使用列宽拖拽光标。
    document.body.style.cursor = "col-resize";
    // 拖拽过程中禁用文本选中，避免功能面板文案被选中。
    document.body.style.userSelect = "none";

    // latestWidth 保存最近一次拖拽宽度，松手时决定是否收成竖条。
    let latestWidth = startWidth;

    // handlePointerMove 根据鼠标移动实时更新右侧功能面板宽度。
    function handlePointerMove(moveEvent: PointerEvent) {
      // 往左拖时 moveEvent.clientX 变小，右侧面板应该变宽，所以这里用 startX - currentX。
      const deltaX = startX - moveEvent.clientX;
      // nextWidth 是限制在最小/最大范围内的右侧面板宽度。
      const nextWidth = Math.min(maxWidth, Math.max(collapsedWidth, startWidth + deltaX));

      // latestWidth 记录最后宽度，cleanup 时决定是否正式收起。
      latestWidth = nextWidth;
      // 写回父组件后，普通态第三列会实时变宽或变窄。
      onSetRightPanelWidth(nextWidth);
    }

    // cleanup 负责恢复页面样式并移除全局事件监听。
    function cleanup() {
      if (latestWidth <= collapseWidth) {
        // 小于收起阈值时，正式关闭详情区，只保留 48px 右侧工具竖条。
        onCloseRight();
        // 收起后恢复默认记忆宽度，下一次打开仍然是正常详情面板。
        onSetRightPanelWidth(360);
      } else if (latestWidth < readableMinWidth) {
        // 未达到收起阈值但已经太窄时，回弹到可读宽度。
        onSetRightPanelWidth(readableMinWidth);
      }

      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
    }

    // pointermove 挂到 window，保证拖到面板外也能继续跟手。
    window.addEventListener("pointermove", handlePointerMove);
    // pointerup 表示拖拽正常结束。
    window.addEventListener("pointerup", cleanup);
    // pointercancel 表示系统取消拖拽，也要做同样清理。
    window.addEventListener("pointercancel", cleanup);
  }

  /**
   * 开始拖拽画板和对话区之间的分割线。
   *
   * 这里做连续宽度调节：
   * - 拖动过程中实时改变对话区宽度。
   * - 小于 120px 时才在松手后收起。
   * - 最大宽度限制在屏幕 50% 左右，避免遮住画板。
   */
  function beginCanvasChatResize(event: ReactPointerEvent<HTMLDivElement>) {
    // 阻止浏览器在拖拽时选中文字，避免用户拖分割线时页面出现蓝色选区。
    event.preventDefault();
    // startX 记录用户按下时的横坐标。
    const startX = event.clientX;
    // startWidth 记录用户开始拖动时的对话区宽度。
    const startWidth = canvasChatCollapsed ? 0 : canvasChatWidth;
    // collapseWidth 是对话区进入收起态的阈值。
    const collapseWidth = 120;
    // minWidth 是拖拽过程允许出现的最小宽度。
    const minWidth = 0;
    // maxWidth 限制对话区最多占屏幕一半，避免画板被挤没。
    const maxWidth = Math.max(360, Math.floor(window.innerWidth * 0.5));
    // latestWidth 保存最近一次拖拽宽度，松手时用来判断是否收起。
    let latestWidth = startWidth;

    // handlePointerMove 根据拖动距离实时更新宽度，不再直接开关。
    function handlePointerMove(moveEvent: PointerEvent) {
      // deltaX 小于 0 表示往左拖，大于 0 表示往右拖。
      const deltaX = moveEvent.clientX - startX;
      // nextWidth 是本次拖动得到的新宽度，并限制在最小和最大范围内。
      // 这个值会实时写回父组件，所以拖动过程是“跟手”的，不再是开关式跳变。
      const nextWidth = Math.min(maxWidth, Math.max(minWidth, startWidth + deltaX));

      // latestWidth 记录最后一次拖动结果，松手时用它决定是否彻底收起。
      latestWidth = nextWidth;
      // 实时更新宽度，layoutTemplate 会重新生成 gridTemplateColumns。
      onSetCanvasChatWidth(nextWidth);

      if (nextWidth > collapseWidth) {
        // 只要超过收起阈值，就认为对话框处于展开态。
        onSetCanvasChatCollapsed(false);
      }
    }

    // cleanup 负责拖拽结束后移除全局监听，避免内存泄漏。
    function cleanup() {
      if (latestWidth <= collapseWidth) {
        // 松手时宽度小于阈值，才真正收起为 0px。
        // 这解决“拖一下就直接开/关”的问题。
        onSetCanvasChatCollapsed(true);
        onSetCanvasChatWidth(0);
      } else {
        // 松手时宽度大于阈值，保留当前拖出来的宽度。
        onSetCanvasChatCollapsed(false);
      }

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
    }

    window.addEventListener("pointermove", handlePointerMove);
    // pointerup 表示鼠标/触控笔松开，这时决定最终是否收起。
    window.addEventListener("pointerup", cleanup);
    // pointercancel 表示系统取消拖拽，也要清理监听。
    window.addEventListener("pointercancel", cleanup);
  }

  return (
    <section className="relative min-w-0 overflow-hidden bg-[#fbfbfa] ring-1 ring-[#eeeeea]">
      {!canvasMode && rightOpen && (
        /*
         * 普通右侧功能面板宽度拖拽热区。
         *
         * 它贴在右侧功能面板左边界：
         * - 不新增竖条。
         * - 不改变右侧工具栏结构。
         * - 只负责让用户横向调节右侧功能详情宽度。
         */
        <div
          aria-label="拖动调整右侧功能面板宽度"
          title="拖动调整右侧功能面板宽度"
          className="absolute bottom-0 left-0 top-0 z-40 w-3 -translate-x-1/2 cursor-col-resize transition hover:bg-[#d8d8d2]/35"
          onPointerDown={beginRightPanelResize}
        />
      )}

      {canvasMode && (
        /*
         * 画板和对话区之间的拖拽热区。
         *
         * 这里故意不渲染可见按钮：
         * - 展开态不能出现用户截图里圈出来的“收起按钮”。
         * - 用户通过边界线拖动来调节/收起。
         * - 热区宽度 3px，视觉上仍然像一条干净分割线。
         */
        <div
          className="absolute bottom-0 left-0 top-0 z-30 w-3 -translate-x-1/2 cursor-col-resize"
          aria-label="拖动调整对话框宽度"
          title="拖动调整对话框宽度"
          onPointerDown={beginCanvasChatResize}
        />
      )}

      {/* 普通产品能力层：进入画板时轻微左移并淡出，但仍保持挂载，避免切换突兀。 */}
      <div
        className={cn(
          "absolute inset-0 transition-[transform,opacity] ease-[cubic-bezier(0.16,1,0.3,1)]",
          canvasMode ? "pointer-events-none -translate-x-8 opacity-0" : "translate-x-0 opacity-100"
        )}
        style={{
          // 普通右侧详情淡出时间跟随右侧宽度，避免宽面板一闪消失。
          transitionDuration: `${Math.round(motionDurationMs * 0.72)}ms`
        }}
      >
        <RightCapabilityPanel
          open={rightOpen}
          activePanel={activePanel}
          onOpenPanel={onOpenPanel}
          onClose={onCloseRight}
        />
      </div>

      {/* 画板层：从右侧滑入，形成“右侧展开”的真实感觉。 */}
      <div
        className={cn(
          "absolute inset-0 transition-[transform,opacity] ease-[cubic-bezier(0.16,1,0.3,1)]",
          canvasMode ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-full opacity-0"
        )}
        style={{
          // 画板层必须和 grid 列宽用同一个主时长，否则画板会像突然跳出来。
          transitionDuration: `${motionDurationMs}ms`
        }}
      >
        <CanvasPane assetTitle={assetTitle} onExit={onExitCanvas} showVoiceButton={showCanvasVoiceButton} />
      </div>
    </section>
  );
}
