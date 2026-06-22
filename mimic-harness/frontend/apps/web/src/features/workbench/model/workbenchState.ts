import type { RightPanel } from "@/features/workbench/components/RightCapabilityPanel";

/**
 * WorkbenchLayoutInput 是工作台总控计算三栏布局所需的最小状态。
 *
 * 管理区域：
 * - 左侧会话列表列宽。
 * - 中间 Agent 对话区列宽。
 * - 右侧能力面板 / 画板列宽。
 *
 * 接口边界：
 * - 这里只做纯前端布局计算，不调用任何接口。
 * - 后续接入用户布局偏好时，可以把这些字段持久化到 GET/PUT /api/users/me/preferences。
 *
 * 改动影响：
 * - 改这里的字段会影响 CreativeWorkbenchPage 的 gridTemplateColumns。
 * - 改宽度默认值会直接影响页面首次打开的左中右比例。
 */
export type WorkbenchLayoutInput = {
  /** leftOpen 表示左侧会话列表是否展开。 */
  leftOpen: boolean;
  /** leftSidebarWidth 表示左侧会话列表展开态宽度，单位 px。 */
  leftSidebarWidth: number;
  /** rightOpen 表示普通右侧能力面板是否展开。 */
  rightOpen: boolean;
  /** rightPanelWidth 表示普通右侧能力面板展开态宽度，单位 px。 */
  rightPanelWidth: number;
  /** canvasMode 表示当前是否进入画板模式。 */
  canvasMode: boolean;
  /** canvasChatCollapsed 表示画板模式下中间对话区是否收起为 0px。 */
  canvasChatCollapsed: boolean;
  /** canvasChatWidth 表示画板模式下中间对话区展开态宽度，单位 px。 */
  canvasChatWidth: number;
};

/**
 * WorkbenchPanelState 是右侧能力面板的最小状态。
 *
 * 管理区域：
 * - 当前右侧能力 tab。
 * - 是否处于画板模式。
 *
 * 接口边界：
 * - 这里不接真实后端，只记录 UI 选中态。
 * - 后续如果要恢复用户上次打开的工具，可由本状态映射到用户偏好接口。
 */
export type WorkbenchPanelState = {
  /** activePanel 记录右侧当前选择的能力入口，例如素材、工作流、网页、导出或画板。 */
  activePanel: RightPanel;
  /** rightOpen 表示普通右侧详情区是否展开。 */
  rightOpen: boolean;
  /** canvasMode 表示是否进入画板编辑态。 */
  canvasMode: boolean;
};

/**
 * DEFAULT_LEFT_SIDEBAR_WIDTH 是左侧会话列表默认宽度。
 *
 * 改动影响：
 * - 改大后左侧更像文件管理器，但会挤压中间对话区。
 * - 改小后列表更轻，但中文标题更容易换行。
 */
export const DEFAULT_LEFT_SIDEBAR_WIDTH = 280;

/**
 * DEFAULT_RIGHT_PANEL_WIDTH 是普通右侧能力面板默认宽度。
 *
 * 改动影响：
 * - 改大后素材/工作流面板更宽，但中间对话区会变窄。
 * - 改小后更接近极简风格，但长文本更容易换行。
 */
export const DEFAULT_RIGHT_PANEL_WIDTH = 360;

/**
 * DEFAULT_CANVAS_CHAT_WIDTH 是画板模式下对话区默认宽度。
 *
 * 改动影响：
 * - 改大后对话更舒服，但画板编辑空间减少。
 * - 改小后画板更大，但用户读上下文会更吃力。
 */
export const DEFAULT_CANVAS_CHAT_WIDTH = 420;

/**
 * DEFAULT_BRIEF 是首屏输入框默认创意需求。
 *
 * 接口边界：
 * - Phase 1.7 只作为前端 mock。
 * - 后续真实提交会进入 POST /api/threads/{threadId}/runs/stream。
 */
export const DEFAULT_BRIEF = "帮我生成夏季气泡咖啡小红书首发素材";

/**
 * DEFAULT_ACTIVE_PANEL 是右侧默认能力入口。
 *
 * 这里默认 assets，是为了第一屏就能说明本项目不是纯聊天 Demo。
 */
export const DEFAULT_ACTIVE_PANEL: RightPanel = "assets";

/**
 * buildWorkbenchLayoutTemplate 生成 CSS gridTemplateColumns。
 *
 * 管理区域：
 * - 工作台最外层三栏布局。
 *
 * 改动影响：
 * - 这里的 48px 是左右收起竖条宽度，改动会影响所有收起态工具栏。
 * - 这里的 minmax(520px, 1fr) 是普通聊天态中间列下限，改小会让对话区更容易挤压。
 */
export function buildWorkbenchLayoutTemplate(input: WorkbenchLayoutInput) {
  // leftColumn 是左侧会话列表列宽，收起时只保留一条窄工具栏。
  const leftColumn = input.leftOpen ? `${input.leftSidebarWidth}px` : "48px";
  // canvasChatColumn 是画板模式下中间对话区列宽。
  // 关键规则：收起时必须是 0px，不能留第二条竖栏；否则会出现“两竖条”。
  const canvasChatColumn = input.canvasChatCollapsed ? "0px" : `${input.canvasChatWidth}px`;

  if (input.canvasMode) {
    // 画板模式三列：左侧列表 / 中间对话 / 右侧画板。
    return `${leftColumn} ${canvasChatColumn} minmax(0, 1fr)`;
  }

  if (input.rightOpen) {
    // 普通工作台三列：左侧列表 + 中间对话 + 右侧能力面板。
    return `${leftColumn} minmax(520px, 1fr) ${input.rightPanelWidth}px`;
  }

  // 普通工作台右侧收起态：右侧只保留 48px 工具栏。
  return `${leftColumn} minmax(0, 1fr) 48px`;
}

/**
 * motionDurationByDistance 根据移动距离计算动画时长。
 *
 * 改动影响：
 * - minDuration 太小会显得硬切。
 * - maxDuration 太大画板会显得拖沓。
 * - durationPerPixel 越大，宽面板展开越慢。
 */
function motionDurationByDistance(distance: number) {
  // minDuration 是很窄面板的最短动画时间，避免小距离也拖泥带水。
  const minDuration = 360;
  // maxDuration 是大画板的最长动画时间，避免慢到影响操作。
  const maxDuration = 980;
  // durationPerPixel 表示每移动 1px 大约需要多少毫秒。
  const durationPerPixel = 1.25;
  // rawDuration 是按距离换算出来的原始时长。
  const rawDuration = Math.round(distance * durationPerPixel);

  // 最终时长夹在 min/max 之间，保证动效既成比例又不失控。
  return Math.min(maxDuration, Math.max(minDuration, rawDuration));
}

/**
 * calculateRightMotionDuration 计算右侧展开/收起动画时长。
 *
 * 管理区域：
 * - 普通右侧能力面板的展开动效。
 * - 画板模式切换时的主画板滑入动效。
 *
 * 改动影响：
 * - 普通面板用 rightPanelWidth 计算。
 * - 画板模式用 rightPanelWidth + canvasChatWidth 估算更大位移，避免画板“啪一下”跳出。
 */
export function calculateRightMotionDuration({
  canvasMode,
  rightPanelWidth,
  canvasChatWidth
}: Pick<WorkbenchLayoutInput, "canvasMode" | "rightPanelWidth" | "canvasChatWidth">) {
  // ordinaryDistance 是普通功能面板从竖条到详情区的移动距离。
  const ordinaryDistance = Math.max(48, rightPanelWidth - 48);
  // canvasDistance 是进入画板时右侧区域需要完成的更大面积变化。
  const canvasDistance = Math.max(ordinaryDistance, rightPanelWidth + canvasChatWidth);

  return motionDurationByDistance(canvasMode ? canvasDistance : ordinaryDistance);
}
