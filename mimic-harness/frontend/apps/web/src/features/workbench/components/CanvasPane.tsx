"use client";

import {
  Check,
  Crop,
  Images,
  Menu,
  MessageCircle,
  MessageSquarePlus,
  Mic,
  MousePointer2,
  PenTool,
  SlidersHorizontal,
  Square
} from "lucide-react";
import { type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent, useState } from "react";
import { IconButton } from "@/shared/ui/IconButton";
import { cn } from "@/shared/lib/cn";

/**
 * 画板工具模式。
 *
 * 三个画板按钮必须有真实作用：
 * - edit：打开图片编辑工具面板。
 * - annotate：打开画布注释工具栏。
 * - filters：展示 AI 图片滤镜列表。
 */
type CanvasTool = "edit" | "annotate" | "filters";

/**
 * 注释工具栏里的二级工具。
 *
 * 注释不是一个单点按钮，而是一组审阅能力：
 * - select：选择画布、画板、图片素材等对象。
 * - pen：用钢笔/自由圈选方式标注区域。
 * - box：用矩形框选方式标注区域。
 * - comment：直接放置文字注释。
 */
type AnnotationTool = "select" | "pen" | "box" | "comment";

/**
 * 注释选区的四角控制点。
 *
 * 用字符串保存方向，后续拖拽缩放时可以直观看出：
 * - nw：左上角。
 * - ne：右上角。
 * - sw：左下角。
 * - se：右下角。
 */
type AnnotationResizeCorner = "nw" | "ne" | "sw" | "se";

/**
 * clampNumber 把数字限制在指定范围内。
 *
 * 画板缩放、图层缩放、面板拖拽都会用到类似边界。
 * 单独抽出来能避免每个交互里都写一遍 Math.min / Math.max。
 */
function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/**
 * 画板编辑态。
 *
 * 画板是本产品区别于普通 Agent Chat 的关键体验：
 * 用户不是只看 Agent 回复，而是可以继续编辑 Agent 生成的图片。
 *
 * 当前接口边界：
 * - Phase 1.7 只使用本地 React state 和 mock 交互，不调用真实后端。
 * - 后续图片滤镜会接 POST /api/assets/{assetId}/filters。
 * - 后续画布注释会接 POST /api/assets/{assetId}/annotations。
 * - 后续图片编辑会接 POST /api/assets/{assetId}/edits。
 *
 * 改动影响：
 * - 改这里的布局类名，会直接影响右侧画板展开后的主体编辑体验。
 * - 改画布尺寸、缩放比例、图层拖拽规则，会影响后续真实图片编辑器的坐标换算。
 */
export function CanvasPane({
  assetTitle,
  onExit,
  showVoiceButton
}: {
  /** assetTitle 是当前正在编辑的素材标题。 */
  assetTitle: string;
  /** onExit 负责退出画板，回到右侧素材面板。 */
  onExit: () => void;
  /** showVoiceButton 表示是否展示画板内部语音按钮。 */
  showVoiceButton: boolean;
}) {
  // activeTool 记录当前画板工具模式；默认选中第一个真实工具“编辑图片”。
  const [activeTool, setActiveTool] = useState<CanvasTool>("edit");
  // toolRailOpen 控制菜单按钮下面的工具组是否展开；菜单按钮自己不再打开参数面板。
  const [toolRailOpen, setToolRailOpen] = useState(true);
  // toolPanelOpen 控制右侧工具参数面板；滤镜和编辑图片需要面板，注释工具栏直接呈现在画布上。
  const [toolPanelOpen, setToolPanelOpen] = useState(true);
  // canvasScale 记录画布缩放比例，范围固定为 20% 到 200%。
  const [canvasScale, setCanvasScale] = useState(1);
  // canvasOffset 记录 10240 x 10240 超大画布相对当前视口的偏移量。
  const [canvasOffset, setCanvasOffset] = useState({ x: -4300, y: -4300 });
  // imageLayer 记录画布里那张 1024 空白图的位置和尺寸；它是画布里的一个可拖拽图层。
  const [imageLayer, setImageLayer] = useState({ x: 4608, y: 4608, size: 1024 });
  // annotationTool 记录注释工具栏当前选中的二级工具。
  const [annotationTool, setAnnotationTool] = useState<AnnotationTool>("select");
  // selectedCanvasObject 记录选择工具当前选中的画布对象，例如画板、图片素材或画布背景。
  const [selectedCanvasObject, setSelectedCanvasObject] = useState("画板");
  // annotationSelection 记录注释选区在超大画布坐标系里的位置和尺寸。
  const [annotationSelection, setAnnotationSelection] = useState({
    // x 是注释选区左上角在 10240 画布里的横向坐标。
    x: 4884,
    // y 是注释选区左上角在 10240 画布里的纵向坐标。
    y: 4884,
    // width 是注释选区宽度，用户拖动控制点会实时改变它。
    width: 430,
    // height 是注释选区高度，用户拖动控制点会实时改变它。
    height: 307
  });
  // annotationNotes 是画布里的注释列表；Phase 1 先用本地假数据表达“可添加注释”的形态。
  const [annotationNotes, setAnnotationNotes] = useState([
    {
      // id 是注释的稳定标识，后续会映射到后端 commentId。
      id: "note-main-visual",
      // text 是注释内容，页面必须使用中文。
      text: "主视觉留白偏大，建议补一层气泡高光。",
      // x 是注释气泡在 10240 画布里的横向坐标。
      x: 5250,
      // y 是注释气泡在 10240 画布里的纵向坐标。
      y: 4800
    }
  ]);

  // isAnnotationMode 表示当前正在演示“画布注释”交互。
  const isAnnotationMode = activeTool === "annotate";
  // isFiltersMode 表示当前正在演示“AI 图片滤镜”交互。
  const isFiltersMode = activeTool === "filters";
  // isEditMode 表示当前正在演示“编辑图片”交互。
  const isEditMode = activeTool === "edit";

  /**
   * 开始拖拽超大画布。
   *
   * 画板必须像真实创作工具：
   * - 外层是固定视口。
   * - 内层是比视口大很多的画布。
   * - 拖动时移动内层画布，而不是移动整个右侧面板。
   */
  function beginCanvasPan(event: ReactPointerEvent<HTMLDivElement>) {
    // 只响应鼠标左键或触控笔主按钮，避免右键菜单和辅助按钮触发拖拽。
    if (event.button !== 0) {
      return;
    }

    // 阻止拖拽时选中文案，保证画布手感像设计工具。
    event.preventDefault();

    // 注释选择工具下，点击画布背景只选中“画布”，不进入拖动画布。
    if (isAnnotationMode && annotationTool === "select") {
      setSelectedCanvasObject("画布");
      console.info("[前端原型] 注释选择工具选中画布背景");
      return;
    }

    // startX / startY 是本次拖拽开始时的指针位置。
    const startX = event.clientX;
    const startY = event.clientY;
    // startOffset 是本次拖拽开始前的画布偏移量。
    const startOffset = canvasOffset;
    // previousCursor 保存页面原始光标，拖拽结束后恢复。
    const previousCursor = document.body.style.cursor;
    // previousUserSelect 保存页面原始文本选择策略，拖拽结束后恢复。
    const previousUserSelect = document.body.style.userSelect;

    // 拖拽期间显示抓取光标，并禁用文本选中。
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    console.info("[前端原型] 开始拖动画板超大画布");

    // handlePointerMove 根据指针移动距离实时平移画布。
    function handlePointerMove(moveEvent: PointerEvent) {
      // deltaX / deltaY 表示这次拖拽相对起点移动了多少像素。
      const deltaX = moveEvent.clientX - startX;
      const deltaY = moveEvent.clientY - startY;

      // 这里暂不做边界夹取，因为第一阶段要先表达“无限大画布”的空间感。
      // 后续接真实编辑器时，再根据画布内容尺寸做吸附、缩放和边界回弹。
      setCanvasOffset({
        x: startOffset.x + deltaX,
        y: startOffset.y + deltaY
      });
    }

    // cleanup 负责拖拽结束后的全局清理。
    function cleanup() {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
      console.info("[前端原型] 结束拖动画板超大画布");
    }

    // pointermove 挂到 window，避免指针离开画布视口后拖拽中断。
    window.addEventListener("pointermove", handlePointerMove);
    // pointerup 表示正常松手结束。
    window.addEventListener("pointerup", cleanup);
    // pointercancel 表示系统取消拖拽，也必须恢复页面状态。
    window.addEventListener("pointercancel", cleanup);
  }

  /**
   * 滚轮缩放 10240 x 10240 超大画布。
   *
   * 规则：
   * - 缩放范围固定为 20% 到 200%。
   * - 以鼠标所在位置为中心缩放，避免一滚轮画面就跑飞。
   * - 缩放只改变画布视野，不改变画布里图片图层自己的尺寸。
   */
  function zoomCanvas(event: ReactWheelEvent<HTMLDivElement>) {
    // 阻止浏览器页面滚动，因为这里滚轮语义是画布缩放。
    event.preventDefault();

    // rect 用来把全局鼠标坐标换算成画板视口内坐标。
    const rect = event.currentTarget.getBoundingClientRect();
    // pointerX / pointerY 是鼠标在画板视口内的位置。
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;
    // nextScale 根据滚轮方向计算，并限制在 20% 到 200%。
    const nextScale = clampNumber(canvasScale - event.deltaY * 0.001, 0.2, 2);
    // worldX / worldY 是鼠标指向的画布坐标，缩放后要保持这个点仍然在鼠标下方。
    const worldX = (pointerX - canvasOffset.x) / canvasScale;
    const worldY = (pointerY - canvasOffset.y) / canvasScale;

    setCanvasScale(nextScale);
    setCanvasOffset({
      x: pointerX - worldX * nextScale,
      y: pointerY - worldY * nextScale
    });
  }

  /**
   * 拖动画布内部的图片图层。
   *
   * 图片是画布内对象，不是画布背景：
   * - 拖图片只改变 imageLayer 坐标。
   * - 不触发外层画布平移。
   * - 鼠标移动距离要除以 canvasScale，才能转换成画布坐标。
   */
  function beginImageDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    // 注释选择工具下，点击图片只选中图片对象，不进入拖拽。
    if (isAnnotationMode && annotationTool === "select") {
      setSelectedCanvasObject("图片素材 / 画板");
      console.info("[前端原型] 注释选择工具选中图片素材和画板");
      return;
    }

    const startX = event.clientX;
    const startY = event.clientY;
    const startLayer = imageLayer;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    console.info("[前端原型] 开始拖动画布图片图层");

    function handlePointerMove(moveEvent: PointerEvent) {
      const deltaX = (moveEvent.clientX - startX) / canvasScale;
      const deltaY = (moveEvent.clientY - startY) / canvasScale;

      setImageLayer({
        ...startLayer,
        x: startLayer.x + deltaX,
        y: startLayer.y + deltaY
      });
    }

    function cleanup() {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
      console.info("[前端原型] 结束拖动画布图片图层");
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", cleanup);
    window.addEventListener("pointercancel", cleanup);
  }

  /**
   * 缩放画布内部的图片图层。
   *
   * 这里先用右下角控制点模拟真实编辑器里的图层缩放：
   * - 图片最小 256px，避免缩到看不见。
   * - 图片最大 4096px，避免第一阶段原型出现离谱尺寸。
   * - 这个缩放不改变画布比例，只改变图片图层尺寸。
   */
  function beginImageResize(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const startX = event.clientX;
    const startSize = imageLayer.size;
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;

    document.body.style.cursor = "nwse-resize";
    document.body.style.userSelect = "none";
    console.info("[前端原型] 开始缩放画布图片图层");

    function handlePointerMove(moveEvent: PointerEvent) {
      const deltaSize = (moveEvent.clientX - startX) / canvasScale;
      const nextSize = clampNumber(startSize + deltaSize, 256, 4096);

      setImageLayer((currentLayer) => ({
        ...currentLayer,
        size: nextSize
      }));
    }

    function cleanup() {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
      console.info("[前端原型] 结束缩放画布图片图层");
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", cleanup);
    window.addEventListener("pointercancel", cleanup);
  }

  /**
   * 拖动画布注释选区。
   *
   * 这个选区必须像真实设计工具里的 mask：
   * - 拖选区只移动选区自身。
   * - 不触发图片图层拖动。
   * - 不触发外层画布平移。
   * - 鼠标位移需要除以 canvasScale，才能还原成画布坐标。
   */
  function beginAnnotationSelectionDrag(event: ReactPointerEvent<HTMLDivElement>) {
    // 只响应鼠标左键，避免右键或辅助按钮误触发。
    if (event.button !== 0) {
      return;
    }

    // 阻止默认文本选择，拖拽时界面才不会出现蓝色选中文本。
    event.preventDefault();
    // 阻止冒泡到图片图层或画布层，避免一拖选区就把整张图或画布带走。
    event.stopPropagation();

    // startX / startY 是本次拖拽开始时的屏幕坐标。
    const startX = event.clientX;
    const startY = event.clientY;
    // startSelection 是拖拽开始前的选区位置和尺寸快照。
    const startSelection = annotationSelection;
    // previousCursor 保存拖拽前的鼠标样式，结束后恢复。
    const previousCursor = document.body.style.cursor;
    // previousUserSelect 保存拖拽前的文本选择样式，结束后恢复。
    const previousUserSelect = document.body.style.userSelect;

    // 拖拽期间给用户明确反馈。
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
    console.info("[前端原型] 开始拖动画布注释选区");

    // handlePointerMove 根据鼠标移动更新选区 x/y。
    function handlePointerMove(moveEvent: PointerEvent) {
      // deltaX / deltaY 是屏幕像素位移，除以缩放比例后才是画布坐标位移。
      const deltaX = (moveEvent.clientX - startX) / canvasScale;
      const deltaY = (moveEvent.clientY - startY) / canvasScale;

      setAnnotationSelection({
        ...startSelection,
        x: startSelection.x + deltaX,
        y: startSelection.y + deltaY
      });
    }

    // cleanup 负责恢复全局鼠标状态，并移除临时监听。
    function cleanup() {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
      console.info("[前端原型] 结束拖动画布注释选区");
    }

    // pointermove 挂在 window，避免鼠标离开选区时拖拽丢失。
    window.addEventListener("pointermove", handlePointerMove);
    // pointerup 表示正常松手。
    window.addEventListener("pointerup", cleanup);
    // pointercancel 表示系统取消拖拽，也必须清理。
    window.addEventListener("pointercancel", cleanup);
  }

  /**
   * 缩放画布注释选区。
   *
   * 四个角分别控制不同方向：
   * - 右下角：增加宽高。
   * - 左上角：移动左上角并反向改变宽高。
   * - 右上角 / 左下角：只改变对应方向。
   */
  function beginAnnotationSelectionResize(
    event: ReactPointerEvent<HTMLButtonElement>,
    corner: AnnotationResizeCorner
  ) {
    // 只响应鼠标左键，保持交互一致。
    if (event.button !== 0) {
      return;
    }

    // 控制点拖动时不能触发选区拖动。
    event.preventDefault();
    // 控制点拖动时也不能冒泡到外层画布。
    event.stopPropagation();

    // startX / startY 是缩放开始时的屏幕坐标。
    const startX = event.clientX;
    const startY = event.clientY;
    // startSelection 是缩放开始前的选区快照。
    const startSelection = annotationSelection;
    // minSize 是选区最小边长，避免缩到看不见。
    const minSize = 96;
    // previousCursor 保存原始光标。
    const previousCursor = document.body.style.cursor;
    // previousUserSelect 保存原始文本选择策略。
    const previousUserSelect = document.body.style.userSelect;

    // 不同角落使用不同光标方向。
    document.body.style.cursor = corner === "nw" || corner === "se" ? "nwse-resize" : "nesw-resize";
    document.body.style.userSelect = "none";
    console.info("[前端原型] 开始缩放画布注释选区", corner);

    // handlePointerMove 根据角点方向更新 x/y/width/height。
    function handlePointerMove(moveEvent: PointerEvent) {
      // deltaX / deltaY 是换算后的画布坐标位移。
      const deltaX = (moveEvent.clientX - startX) / canvasScale;
      const deltaY = (moveEvent.clientY - startY) / canvasScale;
      // nextX 是下一帧选区左上角横坐标。
      let nextX = startSelection.x;
      // nextY 是下一帧选区左上角纵坐标。
      let nextY = startSelection.y;
      // nextWidth 是下一帧选区宽度。
      let nextWidth = startSelection.width;
      // nextHeight 是下一帧选区高度。
      let nextHeight = startSelection.height;

      // 左侧控制点会移动 x，并反向改变宽度。
      if (corner.includes("w")) {
        nextX = startSelection.x + deltaX;
        nextWidth = startSelection.width - deltaX;
      }

      // 右侧控制点只改变宽度。
      if (corner.includes("e")) {
        nextWidth = startSelection.width + deltaX;
      }

      // 上侧控制点会移动 y，并反向改变高度。
      if (corner.includes("n")) {
        nextY = startSelection.y + deltaY;
        nextHeight = startSelection.height - deltaY;
      }

      // 下侧控制点只改变高度。
      if (corner.includes("s")) {
        nextHeight = startSelection.height + deltaY;
      }

      // 宽度小于最小值时，左侧控制点需要回推 x，避免选区反向翻转。
      if (nextWidth < minSize) {
        nextWidth = minSize;
        if (corner.includes("w")) {
          nextX = startSelection.x + startSelection.width - minSize;
        }
      }

      // 高度小于最小值时，上侧控制点需要回推 y，避免选区反向翻转。
      if (nextHeight < minSize) {
        nextHeight = minSize;
        if (corner.includes("n")) {
          nextY = startSelection.y + startSelection.height - minSize;
        }
      }

      setAnnotationSelection({
        x: nextX,
        y: nextY,
        width: nextWidth,
        height: nextHeight
      });
    }

    // cleanup 负责恢复全局交互状态。
    function cleanup() {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
      console.info("[前端原型] 结束缩放画布注释选区", corner);
    }

    // pointermove 挂到 window，保证拖动控制点时不丢失。
    window.addEventListener("pointermove", handlePointerMove);
    // pointerup 表示正常结束。
    window.addEventListener("pointerup", cleanup);
    // pointercancel 表示系统取消，也需要清理。
    window.addEventListener("pointercancel", cleanup);
  }

  /**
   * 切换画板工具按钮组。
   *
   * 菜单按钮只负责折叠/展开下面的工具按钮：
   * - 不直接打开右侧工具参数面板。
   * - 不改变当前正在使用的工具。
   * - 工具组收起时，已打开的参数面板也一起收起，避免页面悬空。
   */
  function toggleToolRail() {
    setToolRailOpen((value) => {
      const nextValue = !value;

      if (!nextValue) {
        setToolPanelOpen(false);
      }

      console.info("[前端原型] 切换画板工具组", nextValue ? "展开" : "收起");
      return nextValue;
    });
  }

  /**
   * 打开图片编辑工具面板。
   *
   * 这里先提供裁切、阴影、透明度等 PS 小工具入口；
   * 后续接真实编辑器时，这些入口会变成可调参数和画布操作。
   */
  function openEditMode() {
    setActiveTool("edit");
    setToolPanelOpen(true);
    console.info("[前端原型] 打开编辑图片工具面板");
  }

  /**
   * 打开注释工具栏。
   *
   * 注释不是单一“钢笔”能力，而是审阅画布的一组工具：
   * - 选择工具：选择画板、图片素材、画布背景。
   * - 钢笔圈选：圈出需要讨论的区域。
   * - 矩形框选：快速框住规则区域。
   * - 添加注释：在当前区域放置一条注释气泡。
   */
  function openAnnotationMode() {
    setActiveTool("annotate");
    setAnnotationTool("select");
    setToolPanelOpen(false);
    console.info("[前端原型] 打开画布注释工具栏");
  }

  /**
   * 切换注释工具栏中的二级工具。
   *
   * 这个函数只改变注释工具，不改变右侧编辑/滤镜面板状态；
   * 因为注释工具栏是直接作用于画布的浮层。
   */
  function chooseAnnotationTool(tool: AnnotationTool) {
    setActiveTool("annotate");
    setAnnotationTool(tool);
    setToolPanelOpen(false);
    console.info("[前端原型] 切换注释工具", tool);
  }

  /**
   * 在当前注释选区旁边追加一条注释。
   *
   * Phase 1 先用固定中文文案表达交互：
   * 后续接后端时，这里会把 commentId、选区坐标、目标对象和评论正文写入接口。
   */
  function addAnnotationNote() {
    const nextIndex = annotationNotes.length + 1;

    setActiveTool("annotate");
    setAnnotationTool("comment");
    setToolPanelOpen(false);
    setAnnotationNotes((currentNotes) => [
      ...currentNotes,
      {
        id: `note-${nextIndex}`,
        text: `注释 ${nextIndex}：请检查${selectedCanvasObject}这里的视觉表达。`,
        x: annotationSelection.x + annotationSelection.width + 24,
        y: annotationSelection.y + 16
      }
    ]);
    console.info("[前端原型] 添加画布注释", nextIndex);
  }

  /**
   * 进入 AI 图片滤镜模式。
   *
   * 右侧工具抽屉会展示滤镜卡片列表，后续接真实图片滤镜或风格迁移能力。
   */
  function openFiltersMode() {
    setActiveTool("filters");
    setToolPanelOpen(true);
    console.info("[前端原型] 进入 AI 图片滤镜模式");
  }

  return (
    <section className="relative h-full min-w-0 bg-panel max-md:absolute max-md:inset-0 max-md:z-40">
      {/* 完成按钮固定在右上角，避免占用画板主体空间。 */}
      <button
        className="absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full bg-panel px-3 py-2 text-sm ring-1 ring-[#e5e5e1]"
        onClick={onExit}
      >
        <Check size={16} />
        完成
      </button>

      {/* 
       * 画板工具组悬浮在画板右侧。
       *
       * 这个节点之前是左侧独立竖栏，用户明确要求不能再占格子：
       * - 不参与 grid 列宽。
       * - 不挤压画布。
       * - 只作为画板内部的悬浮工具条。
       */}
      <div className="absolute right-4 top-16 z-10 flex flex-col items-center gap-2">
        {/* 菜单按钮：只折叠/展开下面的画板工具，不再直接打开参数面板。 */}
        <IconButton
          label={toolRailOpen ? "收起画板工具" : "展开画板工具"}
          active={toolRailOpen}
          className="rounded-xl"
          onClick={toggleToolRail}
        >
          <Menu size={17} />
        </IconButton>
        {/* 
         * 工具组：由菜单按钮控制显隐。
         *
         * 每个工具都保留中文 title/aria-label；
         * 额外的 hover 气泡让用户不用点开也能知道工具含义。
         */}
        <div
          className={cn(
            "flex flex-col items-center gap-2 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
            toolRailOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
          )}
        >
          {/* 编辑图片按钮：打开裁切、阴影、透明度等参数面板。 */}
          <div className="group relative">
            <IconButton label="编辑图片" active={isEditMode && toolPanelOpen} className="rounded-xl" onClick={openEditMode}>
              <Crop size={17} />
            </IconButton>
            <span className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 rounded-full bg-ink px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
              编辑图片
            </span>
          </div>
          {/* 注释按钮：打开画布注释工具栏，钢笔只是其中一个能力。 */}
          <div className="group relative">
            <IconButton label="注释" active={isAnnotationMode} className="rounded-xl" onClick={openAnnotationMode}>
              <MessageSquarePlus size={17} />
            </IconButton>
            <span className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 rounded-full bg-ink px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
              注释
            </span>
          </div>
          {/* AI 图片滤镜按钮：打开滤镜卡片列表。 */}
          <div className="group relative">
            <IconButton label="AI 图片滤镜" active={isFiltersMode && toolPanelOpen} className="rounded-xl" onClick={openFiltersMode}>
              <Images size={17} />
            </IconButton>
            <span className="pointer-events-none absolute right-12 top-1/2 -translate-y-1/2 rounded-full bg-ink px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
              AI 图片滤镜
            </span>
          </div>
        </div>
      </div>

      {isAnnotationMode && (
        /*
         * 注释工具栏。
         *
         * 用户要求“原来的重绘能力升级成注释，点开是一个工具栏”：
         * - 它不是右侧大面板。
         * - 它悬浮在画布里，直接服务画布审阅。
         * - 钢笔只是其中一个能力，旁边还有选择、矩形框选和添加注释。
         */
        <div className="absolute right-16 top-16 z-20 flex items-center gap-2 rounded-2xl bg-panel p-2 ring-1 ring-[#e5e5e1]">
          {/* 选择工具：用于选择画布、画板、图片素材等对象。 */}
          <IconButton
            label="选择工具"
            active={annotationTool === "select"}
            className="h-9 w-9 rounded-xl"
            onClick={() => chooseAnnotationTool("select")}
          >
            <MousePointer2 size={16} />
          </IconButton>
          {/* 钢笔圈选：用于自由圈选区域后添加注释。 */}
          <IconButton
            label="钢笔圈选"
            active={annotationTool === "pen"}
            className="h-9 w-9 rounded-xl"
            onClick={() => chooseAnnotationTool("pen")}
          >
            <PenTool size={16} />
          </IconButton>
          {/* 矩形框选：用于快速框住规则区域。 */}
          <IconButton
            label="矩形框选"
            active={annotationTool === "box"}
            className="h-9 w-9 rounded-xl"
            onClick={() => chooseAnnotationTool("box")}
          >
            <Square size={16} />
          </IconButton>
          {/* 添加注释：把当前选区写成一条注释气泡。 */}
          <IconButton
            label="添加注释"
            active={annotationTool === "comment"}
            className="h-9 w-9 rounded-xl"
            onClick={addAnnotationNote}
          >
            <MessageCircle size={16} />
          </IconButton>
          {/* 当前选择提示：让新手知道选择工具正在选中哪个画布对象。 */}
          <span className="px-2 text-xs text-muted">已选中：{selectedCanvasObject}</span>
        </div>
      )}

      {/* 工具参数面板：只有“编辑图片”和“AI 图片滤镜”会打开；注释工具栏直接呈现在画布上。 */}
      <div
        className={cn(
          "absolute bottom-16 right-16 top-16 z-20 w-64 rounded-2xl bg-panel p-4 ring-1 ring-[#e5e5e1] transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
          toolPanelOpen ? "translate-x-0 opacity-100" : "pointer-events-none translate-x-4 opacity-0"
        )}
      >
        <div className="text-sm font-semibold">{isFiltersMode ? "AI 图片滤镜" : "编辑图片"}</div>
        {isEditMode && (
          <div className="mt-4 space-y-3 text-sm text-muted">
            {[
              ["裁切", "调整画面比例和主体位置。"],
              ["阴影", "控制投影强度、距离和柔和度。"],
              ["透明度", "调整图层整体透明度。"],
              ["锐化", "提升边缘细节和文字清晰度。"]
            ].map(([name, description]) => (
              <button key={name} className="block w-full rounded-xl bg-neutral-50 px-3 py-3 text-left">
                <div className="flex items-center gap-2 font-medium text-ink">
                  <SlidersHorizontal size={14} />
                  {name}
                </div>
                <div className="mt-1 text-xs leading-5 text-muted">{description}</div>
              </button>
            ))}
          </div>
        )}
        {isFiltersMode && (
          <div className="mt-4 space-y-3 text-sm text-muted">
            {[
              ["冷萃浅灰", "降低饱和度，保留杯壁水珠和冰感。"],
              ["气泡高光", "增强高光和透明气泡，适合主视觉。"],
              ["夏日奶白", "提高亮度和柔和感，适合小红书封面。"],
              ["胶片颗粒", "加入轻微颗粒和暖灰影调。"]
            ].map(([name, description]) => (
              <button key={name} className="block w-full rounded-xl bg-neutral-50 px-3 py-3 text-left">
                <div className="font-medium text-ink">{name}</div>
                <div className="mt-1 text-xs leading-5 text-muted">{description}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 
       * 画板主体铺满右侧工作区。
       *
       * 注意这里 left=0，不再 left=12：
       * - 因为工具条已经变成画板内部悬浮。
       * - 画布不能再为工具条预留一条竖格。
       */}
      <div
        className="absolute inset-y-0 left-0 right-0 overflow-hidden bg-[#eeeeea] cursor-grab active:cursor-grabbing"
        onPointerDown={beginCanvasPan}
        onWheel={zoomCanvas}
      >
        {/* 当前画布缩放比例：必须固定显示，范围为 20% 到 200%。 */}
        <div className="pointer-events-none absolute bottom-5 right-5 z-10 rounded-full bg-panel px-3 py-1.5 text-xs font-medium text-muted ring-1 ring-[#e5e5e1]">
          {Math.round(canvasScale * 100)}%
        </div>
        {/* 
         * 超大画布层。
         *
         * 这个层比右侧视口大很多，用户拖动时移动的是它。
         * 工具栏、完成按钮、语音按钮都放在外层，不会随着画布一起跑。
         */}
        <div
          className="absolute left-0 top-0 h-[10240px] w-[10240px] bg-[radial-gradient(circle,#d9d9d4_1px,transparent_1px)] [background-size:28px_28px]"
          style={{
            // translate3d 只触发 transform 合成层，拖拽更顺滑，不引发布局重排。
            transform: `translate3d(${canvasOffset.x}px, ${canvasOffset.y}px, 0) scale(${canvasScale})`,
            // transformOrigin 固定左上角，便于用坐标计算画布拖动和缩放。
            transformOrigin: "0 0"
          }}
        >
          {/* 
           * 1024 x 1024 空白图。
           *
           * 用户要求默认先放中间一张空白图：
           * - 这里固定为 1024px 正方形，模拟真实生图结果的编辑画布。
           * - 外层超大画布负责拖动，空白图本身不抢工具栏空间。
           */}
          <div
            className={cn(
              "absolute cursor-grab rounded-[28px] bg-white ring-1 ring-[#d8d8d2] active:cursor-grabbing",
              isAnnotationMode && selectedCanvasObject.includes("图片素材") && "ring-2 ring-[#2688ff]"
            )}
            style={{
              // imageLayer.x / y 是图片在 10240 画布坐标系里的位置。
              left: `${imageLayer.x}px`,
              top: `${imageLayer.y}px`,
              // imageLayer.size 是图片图层自身尺寸，和画布缩放比例互不影响。
              width: `${imageLayer.size}px`,
              height: `${imageLayer.size}px`
            }}
            onPointerDown={beginImageDrag}
          >
            {/* 空白图左上角只保留轻量标题，避免把画板变成说明页。 */}
            <div className="absolute left-8 top-7">
              <div className="text-xs font-semibold tracking-normal text-muted">可编辑画板</div>
              <h2 className="mt-3 text-3xl font-semibold">{assetTitle}</h2>
            </div>
            {/* 空白图底部保留当前模式说明，后续可替换成真实画布状态栏。 */}
            <div className="absolute bottom-8 left-8 max-w-md text-sm leading-6 text-muted">
              当前模式：{isFiltersMode ? "AI 图片滤镜" : isAnnotationMode ? "画布注释" : "编辑图片"}。拖动画布可移动视野。
            </div>
            {/* 右下角缩放控制点：拖动它只缩放这张图片，不缩放整个画布。 */}
            <button
              aria-label="缩放图片图层"
              title="缩放图片图层"
              className="absolute -bottom-3 -right-3 h-7 w-7 cursor-nwse-resize rounded-full bg-panel ring-2 ring-ink"
              onPointerDown={beginImageResize}
            />
          </div>

          {/* 左上角辅助坐标块：让用户一眼知道这是大画布，而不是普通背景。 */}
          <div className="absolute left-[300px] top-[170px] rounded-full bg-panel px-3 py-1 text-xs text-muted ring-1 ring-[#d8d8d2]">
            超大画布，可按住拖动
          </div>

          {/* 
           * 画布注释气泡列表。
           *
           * Phase 1 先用本地状态渲染：
           * - 点击“添加注释”会追加一条气泡。
           * - 点击气泡会选中“注释”对象。
           * - 后续后端会把这些数据保存为 annotation/comment 表。
           */}
          {annotationNotes.map((note) => (
            <button
              key={note.id}
              className="absolute max-w-[260px] rounded-2xl bg-ink px-4 py-3 text-left text-sm leading-6 text-white"
              style={{
                // note.x 是注释气泡在 10240 画布里的横向坐标。
                left: `${note.x}px`,
                // note.y 是注释气泡在 10240 画布里的纵向坐标。
                top: `${note.y}px`
              }}
              onPointerDown={(event) => {
                // 注释气泡点击不能触发画布拖动。
                event.stopPropagation();
                // 选中对象显示到注释工具栏右侧。
                setSelectedCanvasObject("注释");
                console.info("[前端原型] 注释选择工具选中注释气泡", note.id);
              }}
            >
              {note.text}
            </button>
          ))}

          {isAnnotationMode && annotationTool !== "select" && (
            /* 
             * 画布注释模式：钢笔圈选 / 矩形框选。
             *
             * 不再只画一个普通虚线框，而是模拟真实编辑器里的选区：
             * - 左上角有钢笔工具标签。
             * - 四角有控制柄。
             * - 内部有淡色遮罩，表达“这一块会被注释评论”。
             */
            <div
              className="absolute cursor-grab rounded-[28px] border-2 border-dashed border-ink/55 bg-white/30 active:cursor-grabbing"
              style={{
                // annotationSelection.x 是选区左上角画布坐标，拖动选区时会实时变化。
                left: `${annotationSelection.x}px`,
                // annotationSelection.y 是选区左上角画布坐标，拖动选区时会实时变化。
                top: `${annotationSelection.y}px`,
                // annotationSelection.width 是选区宽度，拖动四角控制点时会实时变化。
                width: `${annotationSelection.width}px`,
                // annotationSelection.height 是选区高度，拖动四角控制点时会实时变化。
                height: `${annotationSelection.height}px`
              }}
              onPointerDown={beginAnnotationSelectionDrag}
            >
              <div className="absolute -top-11 left-0 inline-flex items-center gap-2 rounded-full bg-panel px-3 py-2 text-xs font-medium ring-1 ring-[#e5e5e1]">
                {annotationTool === "pen" ? <PenTool size={14} /> : <Square size={14} />}
                {annotationTool === "pen" ? "钢笔圈选注释" : "矩形框选注释"}
              </div>
              {/* 左上角控制点：拖动它会同时改变 x/y/宽/高。 */}
              <button
                aria-label="缩放左上角选区"
                title="缩放左上角选区"
                className="absolute -left-2 -top-2 h-4 w-4 cursor-nwse-resize rounded-full bg-panel ring-2 ring-ink"
                onPointerDown={(event) => beginAnnotationSelectionResize(event, "nw")}
              />
              {/* 右上角控制点：拖动它会改变 y/宽/高。 */}
              <button
                aria-label="缩放右上角选区"
                title="缩放右上角选区"
                className="absolute -right-2 -top-2 h-4 w-4 cursor-nesw-resize rounded-full bg-panel ring-2 ring-ink"
                onPointerDown={(event) => beginAnnotationSelectionResize(event, "ne")}
              />
              {/* 左下角控制点：拖动它会改变 x/宽/高。 */}
              <button
                aria-label="缩放左下角选区"
                title="缩放左下角选区"
                className="absolute -bottom-2 -left-2 h-4 w-4 cursor-nesw-resize rounded-full bg-panel ring-2 ring-ink"
                onPointerDown={(event) => beginAnnotationSelectionResize(event, "sw")}
              />
              {/* 右下角控制点：拖动它会改变宽/高。 */}
              <button
                aria-label="缩放右下角选区"
                title="缩放右下角选区"
                className="absolute -bottom-2 -right-2 h-4 w-4 cursor-nwse-resize rounded-full bg-panel ring-2 ring-ink"
                onPointerDown={(event) => beginAnnotationSelectionResize(event, "se")}
              />
              <div className="absolute inset-4 rounded-[22px] bg-[#f5f5f3]/70" />
            </div>
          )}
        </div>
      </div>

      {showVoiceButton && (
        /* 
         * 对话框收起后才展示画板内部小话筒。
         *
         * 如果对话框展开，底部输入区已经有语音按钮；
         * 此处必须隐藏，避免同一功能出现两套入口。
         */
        <button
          className="absolute bottom-5 left-1/2 inline-flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-panel text-muted ring-1 ring-[#e5e5e1]"
          aria-label="按住语音输入画板编辑指令"
          title="按住语音输入画板编辑指令"
        >
          <Mic size={23} />
        </button>
      )}
    </section>
  );
}
