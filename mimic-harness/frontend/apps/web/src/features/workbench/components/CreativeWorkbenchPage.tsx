"use client";

import { useMemo, useState } from "react";
import { ConversationPane } from "@/features/workbench/components/ConversationPane";
import { ConversationListPanel } from "@/features/workbench/components/ConversationListPanel";
import { type RightPanel } from "@/features/workbench/components/RightCapabilityPanel";
import { SideStagePane } from "@/features/workbench/components/SideStagePane";
import {
  openWorkbenchPanel,
  reopenCanvasChat,
  submitCreativeBrief,
  toggleCanvasChat,
  type WorkbenchSetters
} from "@/features/workbench/model/workbenchActions";
import {
  mockAssets,
  mockRuntimes,
  mockThreads
} from "@/features/workbench/model/mockData";
import {
  buildWorkbenchLayoutTemplate,
  calculateRightMotionDuration,
  DEFAULT_ACTIVE_PANEL,
  DEFAULT_BRIEF,
  DEFAULT_CANVAS_CHAT_WIDTH,
  DEFAULT_LEFT_SIDEBAR_WIDTH,
  DEFAULT_RIGHT_PANEL_WIDTH
} from "@/features/workbench/model/workbenchState";

/**
 * CreativeWorkbenchPage 是 Phase 1.6 的主工作台原型。
 *
 * 它承担三件事：
 * 1. 验证“类 Codex 极简面板”这个交互形态。
 * 2. 表达 AIGC 创意生产 Agent 的主链路，而不是普通聊天 Demo。
 * 3. 给后续 Java / Python Mock SSE 联调提供前端状态和组件拆分基线。
 */
export function CreativeWorkbenchPage() {
  // leftOpen 控制左侧会话列表是否展开，用户要求对话列表可收起。
  const [leftOpen, setLeftOpen] = useState(true);
  // leftSidebarWidth 记录左侧会话列表的真实宽度，用户拖拽左侧右边界时会实时更新。
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(DEFAULT_LEFT_SIDEBAR_WIDTH);
  // 右侧产品能力面板：默认打开素材，是为了第一屏就能看出本项目不是纯聊天。
  const [rightOpen, setRightOpen] = useState(true);
  // rightPanelWidth 记录右侧功能面板的真实宽度，用户拖拽右侧左边界时会实时更新。
  const [rightPanelWidth, setRightPanelWidth] = useState(DEFAULT_RIGHT_PANEL_WIDTH);
  // activePanel 记录右侧当前选择的能力入口，例如素材、工作流、网页、导出或画板。
  const [activePanel, setActivePanel] = useState<RightPanel>(DEFAULT_ACTIVE_PANEL);
  // 画板模式会改变整体布局：对话区缩到左侧约 1/3，画板占据主空间。
  const [canvasMode, setCanvasMode] = useState(false);
  // canvasChatCollapsed 只控制画板模式下的对话框收起状态，普通聊天态不受影响。
  // 注意：收起后是否显示聊天气泡，要看 leftOpen。
  // - leftOpen=true：左侧列表展开，聊天气泡不显示，点击列表会话重新打开对话框。
  // - leftOpen=false：左侧列表收起，聊天气泡合并到同一条左侧窄栏。
  const [canvasChatCollapsed, setCanvasChatCollapsed] = useState(false);
  // canvasChatWidth 记录画板模式下对话区的真实宽度，拖拽分割线时会连续变化。
  // 这个值只在 canvasChatCollapsed=false 时参与布局；收起态直接使用 0px。
  const [canvasChatWidth, setCanvasChatWidth] = useState(DEFAULT_CANVAS_CHAT_WIDTH);
  // 创意需求是用户输入的任务描述。Phase 1.6 本地保存在 React state，后续会进入 Message / Run contracts。
  const [brief, setBrief] = useState(DEFAULT_BRIEF);

  // 运行时切换的第一版占位：先使用 Java，后续设置页会支持真实切换。
  const selectedRuntime = mockRuntimes[0];
  const activeAsset = mockAssets[0];

  // workbenchSetters 把总控状态写入器集中传给行为函数，避免 openPanel 这类动作散落在 JSX 里。
  const workbenchSetters: WorkbenchSetters = {
    setRightOpen,
    setActivePanel,
    setCanvasMode,
    setCanvasChatCollapsed,
    setCanvasChatWidth
  };

  /**
   * 根据当前面板模式决定桌面布局。
   *
   * 这里不用固定三栏，是为了遵守 V5/V6 设计修正：
   * - 普通模式：对话区 + 右侧产品能力。
   * - 画板模式：对话区压到左侧，画板顶满右侧。
   */
  const layoutTemplate = useMemo(() => {
    return buildWorkbenchLayoutTemplate({
      leftOpen,
      leftSidebarWidth,
      rightOpen,
      rightPanelWidth,
      canvasMode,
      canvasChatCollapsed,
      canvasChatWidth
    });
  }, [canvasChatCollapsed, canvasChatWidth, canvasMode, leftOpen, leftSidebarWidth, rightOpen, rightPanelWidth]);

  /**
   * 右侧展开/收起动画时长。
   *
   * 普通右侧面板：按详情区宽度和 48px 竖条之间的差值计算。
   * 画板模式：画板会吃掉右侧大区域，所以用右侧面板宽度 + 对话区宽度估算更长距离。
   */
  const rightMotionDurationMs = useMemo(() => {
    return calculateRightMotionDuration({
      canvasMode,
      rightPanelWidth,
      canvasChatWidth
    });
  }, [canvasChatWidth, canvasMode, rightPanelWidth]);

  /**
   * 提交创意需求的前端占位。
   *
   * 后续联调时这里会替换为：
   * POST /api/threads/{threadId}/runs/stream
   * 并解析 text/event-stream，把 run、trace、asset 状态逐步合并到页面。
   */
  function submitBrief() {
    submitCreativeBrief({ brief, selectedRuntime });
  }

  /**
   * 打开右侧产品能力面板。
   *
   * 画板是特殊模式：它不是普通右侧详情，而是会重排主工作区。
   * 这对应用户要求的“打开画板后把对话推到左边 1/3 屏”。
   */
  function openPanel(panel: RightPanel) {
    openWorkbenchPanel(panel, workbenchSetters);
  }

  return (
    <main className="h-screen overflow-hidden bg-canvas text-ink">
      <section className="flex h-full flex-col overflow-hidden bg-panel">
        <div
          className="relative grid min-h-0 flex-1 overflow-hidden transition-[grid-template-columns] ease-[cubic-bezier(0.16,1,0.3,1)] max-md:grid-cols-[1fr]"
          style={{
            // gridTemplateColumns 是左右面板真正推拉的主体。
            gridTemplateColumns: layoutTemplate,
            // transitionDuration 必须和右侧真实移动距离成比例，避免画板突然跳出。
            transitionDuration: `${rightMotionDurationMs}ms`
          }}
        >
          <ConversationListPanel
            // open 控制左侧列表是否完整展开。
            open={leftOpen}
            // canvasMode 告诉左侧栏当前是否进入画板态，只有画板态才需要合并聊天入口。
            canvasMode={canvasMode}
            // canvasChatCollapsed 用于决定列表收起时是否显示聊天气泡入口。
            canvasChatCollapsed={canvasChatCollapsed}
            // leftSidebarWidth 是左侧列表当前宽度，拖拽边界时需要从这个值开始计算。
            leftSidebarWidth={leftSidebarWidth}
            // threads 是左侧项目列表数据，当前来自 mock，后续会接真实会话接口。
            threads={mockThreads}
            // onSetLeftSidebarWidth 负责把拖拽后的左侧列表宽度写回父组件。
            onSetLeftSidebarWidth={setLeftSidebarWidth}
            // onToggle 切换左侧列表展开/收起。
            onToggle={() => setLeftOpen((value) => !value)}
            // onCollapse 只负责把左侧列表收成竖条，给拖拽阈值收起使用。
            onCollapse={() => setLeftOpen(false)}
            // onOpenCanvasChat 是“从左侧列表重新打开对话框”的统一入口。
            onOpenCanvasChat={() => reopenCanvasChat(workbenchSetters)}
          />

          <ConversationPane
            canvasMode={canvasMode}
            brief={brief}
            onBriefChange={setBrief}
            onSubmit={submitBrief}
            onOpenCanvas={() => openPanel("canvas")}
            canvasChatCollapsed={canvasChatCollapsed}
            // 当左侧列表展开时，收起后的对话入口不在中间列显示；列表项负责重新打开。
            // 当左侧列表收起时，气泡会合并进左侧窄栏。
            showCollapsedChatButton={!leftOpen}
            onToggleCanvasChat={() => toggleCanvasChat(workbenchSetters)}
          />

          <SideStagePane
            canvasMode={canvasMode}
            rightOpen={rightOpen}
            activePanel={activePanel}
            assetTitle={activeAsset.title}
            onOpenPanel={openPanel}
            onCloseRight={() => setRightOpen(false)}
            onExitCanvas={() => openPanel("assets")}
            showCanvasVoiceButton={canvasChatCollapsed}
            canvasChatCollapsed={canvasChatCollapsed}
            onSetCanvasChatCollapsed={setCanvasChatCollapsed}
            canvasChatWidth={canvasChatWidth}
            onSetCanvasChatWidth={setCanvasChatWidth}
            rightPanelWidth={rightPanelWidth}
            onSetRightPanelWidth={setRightPanelWidth}
            motionDurationMs={rightMotionDurationMs}
          />
        </div>
      </section>
    </main>
  );
}
