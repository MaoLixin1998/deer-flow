import type { Dispatch, SetStateAction } from "react";
import type { RuntimeInfo } from "@/entities/runtime/types";
import type { RightPanel } from "@/features/workbench/components/RightCapabilityPanel";
import { DEFAULT_CANVAS_CHAT_WIDTH } from "@/features/workbench/model/workbenchState";

/**
 * WorkbenchSetters 是工作台总控传给行为函数的状态写入器集合。
 *
 * 管理区域：
 * - 右侧能力面板开关。
 * - 画板模式开关。
 * - 画板对话区收起/展开。
 *
 * 接口边界：
 * - 这里只封装前端状态变化，不直接调接口。
 */
export type WorkbenchSetters = {
  /** setRightOpen 负责打开或收起普通右侧能力详情。 */
  setRightOpen: Dispatch<SetStateAction<boolean>>;
  /** setActivePanel 负责记录当前右侧能力入口。 */
  setActivePanel: Dispatch<SetStateAction<RightPanel>>;
  /** setCanvasMode 负责进入或退出画板模式。 */
  setCanvasMode: Dispatch<SetStateAction<boolean>>;
  /** setCanvasChatCollapsed 负责控制画板模式下中间对话区是否收起。 */
  setCanvasChatCollapsed: Dispatch<SetStateAction<boolean>>;
  /** setCanvasChatWidth 负责恢复或更新画板模式下中间对话区宽度。 */
  setCanvasChatWidth: Dispatch<SetStateAction<number>>;
};

/**
 * openWorkbenchPanel 打开右侧产品能力面板。
 *
 * 管理区域：
 * - 普通素材、工作流、网页、导出面板。
 * - 特殊画板模式。
 *
 * 接口边界：
 * - Phase 1.7 只切换前端状态，不调用真实接口。
 * - 后续可以在这里触发 GET /api/assets 或 GET /api/workflows 的预加载。
 *
 * 改动影响：
 * - 如果去掉 setCanvasChatCollapsed(false)，用户重新进入画板时可能误以为对话区丢失。
 */
export function openWorkbenchPanel(panel: RightPanel, setters: WorkbenchSetters) {
  // 打开任何右侧能力时，都先保证右侧能力区域处于展开状态。
  setters.setRightOpen(true);
  // activePanel 记录具体打开哪个能力。
  setters.setActivePanel(panel);
  // 只有 panel 是 canvas 时才进入画板模式。
  setters.setCanvasMode(panel === "canvas");
  // 每次重新进入画板时默认恢复对话框，避免用户误以为对话功能丢了。
  setters.setCanvasChatCollapsed(false);
  console.info("[前端原型] 切换右侧产品能力面板", { panel });
}

/**
 * reopenCanvasChat 从左侧会话列表恢复画板对话区。
 *
 * 管理区域：
 * - 左侧列表展开时，点击会话重新打开中间对话区。
 *
 * 改动影响：
 * - DEFAULT_CANVAS_CHAT_WIDTH 决定恢复后的对话区宽度。
 */
export function reopenCanvasChat(setters: Pick<WorkbenchSetters, "setCanvasChatWidth" | "setCanvasChatCollapsed">) {
  // 点击会话重新打开时，恢复一个可读的默认宽度。
  setters.setCanvasChatWidth(DEFAULT_CANVAS_CHAT_WIDTH);
  // 解除对话框收起状态。
  setters.setCanvasChatCollapsed(false);
}

/**
 * toggleCanvasChat 切换画板模式下的对话区展开/收起。
 *
 * 管理区域：
 * - 左侧窄栏里的聊天气泡。
 *
 * 改动影响：
 * - 从收起态恢复时必须同步恢复宽度，否则 grid 中间列仍然是 0px。
 */
export function toggleCanvasChat(setters: Pick<WorkbenchSetters, "setCanvasChatWidth" | "setCanvasChatCollapsed">) {
  setters.setCanvasChatCollapsed((value) => {
    if (value) {
      // 从收起态点气泡重新展开时恢复默认宽度。
      setters.setCanvasChatWidth(DEFAULT_CANVAS_CHAT_WIDTH);
    }

    return !value;
  });
}

/**
 * submitCreativeBrief 记录创意需求提交占位日志。
 *
 * 管理区域：
 * - 中间 Agent 输入框提交按钮。
 *
 * 接口边界：
 * - Phase 1.7 只打印中文日志。
 * - Phase 1.8 会替换为 POST /api/threads/{threadId}/runs/stream。
 *
 * 改动影响：
 * - 后续真实联调时，这里会成为 SSE 连接入口。
 */
export function submitCreativeBrief({
  brief,
  selectedRuntime
}: {
  /** brief 是用户输入的创意需求。 */
  brief: string;
  /** selectedRuntime 是当前选中的 Java/Python 运行时。 */
  selectedRuntime: RuntimeInfo;
}) {
  console.info("[前端原型] 用户提交创意需求，后续将调用 POST /api/threads/{threadId}/runs/stream", {
    brief,
    runtime: selectedRuntime.runtime
  });
}
