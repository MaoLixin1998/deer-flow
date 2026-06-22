"use client";

import { Code2, Download, Images, PackageCheck, PencilRuler, Workflow, X } from "lucide-react";
import { IconButton } from "@/shared/ui/IconButton";
import { cn } from "@/shared/lib/cn";
import { mockAssets, mockTraceEvents } from "@/features/workbench/model/mockData";

/**
 * RightPanel 是右侧产品能力面板的枚举。
 *
 * 注意：
 * 这里故意不用“审查 / 终端 / 浏览器 / 文件”，因为本项目主题是
 * AIGC 创意生产工作流 Agent。右侧面板必须服务“生图、生视频、生 HTML、工作流、导出”。
 */
export type RightPanel = "canvas" | "assets" | "workflow" | "html" | "export" | null;

/**
 * rightTools 是右侧一级产品能力入口配置。
 *
 * 这些 key 后续会和 contracts 里的素材、Trace、HTML 预览、导出任务产生映射。
 * Phase 1.7 仍然只做前端 mock，不能在这里临时增加没有产品定义的能力入口。
 */
const rightTools = [
  {
    // key 是内部面板标识，点击后会切换到画板模式。
    key: "canvas",
    // label 是页面展示文案，必须使用中文。
    label: "画板",
    // icon 是 lucide 图标组件，保证工具栏视觉统一。
    icon: PencilRuler
  },
  {
    // key 是素材面板标识，对应右侧素材列表。
    key: "assets",
    // label 是页面展示文案。
    label: "素材",
    // icon 是素材入口图标。
    icon: Images
  },
  {
    // key 是工作流面板标识，对应 Trace 时间线。
    key: "workflow",
    // label 是页面展示文案。
    label: "工作流",
    // icon 是工作流入口图标。
    icon: Workflow
  },
  {
    // key 是网页面板标识，对应活动页预览。
    key: "html",
    // label 使用“网页”，避免页面出现英文 HTML。
    label: "网页",
    // icon 是代码预览图标。
    icon: Code2
  },
  {
    // key 是导出面板标识，对应交付包导出。
    key: "export",
    // label 是页面展示文案。
    label: "导出",
    // icon 是导出交付包图标。
    icon: PackageCheck
  }
] as const;

/**
 * RightCapabilityPanelProps 描述普通右侧能力面板需要的外部状态。
 *
 * 父组件只负责保存“展开状态”和“当前能力”，本组件负责展示能力入口和详情。
 */
type RightCapabilityPanelProps = {
  /** open 控制右侧产品能力详情是否展开。 */
  open: boolean;
  /** activePanel 表示当前选中的右侧能力，例如素材、工作流、网页。 */
  activePanel: RightPanel;
  /** onOpenPanel 负责切换右侧能力面板。 */
  onOpenPanel: (panel: RightPanel) => void;
  /** onClose 负责关闭右侧详情区域。 */
  onClose: () => void;
};

/**
 * RightCapabilityPanel 是右侧产品能力面板。
 *
 * 职责边界：
 * - 展示一级能力图标栏。
 * - 展示素材、工作流、网页、导出、画板入口详情。
 * - 不负责画板编辑态本体，真正画板仍由 CanvasPane 承担。
 */
export function RightCapabilityPanel({ open, activePanel, onOpenPanel, onClose }: RightCapabilityPanelProps) {
  return (
    <aside className="relative h-full min-w-0 bg-[#fbfbfa] max-md:absolute max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:z-30 max-md:h-[58dvh] max-md:rounded-t-2xl">
      <div className="flex h-full">
        {/* 一级能力栏：只用图标表达入口，不再塞文字，减少视觉噪声。 */}
        <nav className="flex w-12 shrink-0 flex-col items-center gap-2 bg-[#f8f8f6] py-3">
          {rightTools.map((tool) => {
            // Icon 是当前能力对应的 lucide 图标组件。
            const Icon = tool.icon;

            return (
              <IconButton
                // key 使用能力枚举，保证 React 列表稳定。
                key={tool.key}
                // label 使用中文，既给 title，也给 aria-label。
                label={`打开${tool.label}`}
                // active 控制黑底白图标的选中态。
                active={activePanel === tool.key}
                // 点击后切换具体产品能力面板。
                onClick={() => onOpenPanel(tool.key)}
                // 圆角更接近当前白灰 iOS 风格。
                className="h-9 w-9 rounded-xl"
              >
                <Icon size={17} />
              </IconButton>
            );
          })}
        </nav>

        <div
          className={cn(
            "smooth-drawer min-w-0 flex-1",
            open ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
          )}
        >
          <div className="flex h-12 items-center justify-between px-3">
            <div className="text-sm font-semibold">{panelTitle(activePanel)}</div>
            <IconButton label="关闭右侧产品能力" className="rounded-xl" onClick={onClose}>
              <X size={17} />
            </IconButton>
          </div>
          <div className="thin-scrollbar h-[calc(100%-48px)] overflow-auto">
            {activePanel === "assets" && <AssetsPanel />}
            {activePanel === "workflow" && <WorkflowPanel />}
            {activePanel === "html" && <HtmlPanel />}
            {activePanel === "export" && <ExportPanel />}
            {activePanel === "canvas" && <CanvasIntroPanel onOpen={() => onOpenPanel("canvas")} />}
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * panelTitle 集中处理右侧面板标题。
 *
 * 后续如果做国际化、权限控制或能力开关，不需要到每个 JSX 分支里找文案。
 */
function panelTitle(panel: RightPanel) {
  // matched 是当前 activePanel 对应的一级能力配置。
  const matched = rightTools.find((tool) => tool.key === panel);

  // 如果没有匹配，返回兜底文案，避免页面出现空标题。
  return matched ? matched.label : "产品能力";
}

/**
 * assetTypeLabel 把 contracts 里的素材类型枚举翻译成中文。
 *
 * 后端和测试继续使用英文枚举，前端页面不能直接把 enum 丢给用户看。
 */
function assetTypeLabel(type: string) {
  const labels: Record<string, string> = {
    // image 表示图片素材。
    image: "图片",
    // video_storyboard 表示短视频分镜。
    video_storyboard: "短视频分镜",
    // html 表示网页片段。
    html: "网页",
    // compliance_report 表示合规报告。
    compliance_report: "合规报告"
  };

  return labels[type] ?? type;
}

/**
 * statusLabel 把 contracts 里的状态枚举翻译成中文。
 *
 * 展示层用中文，接口层仍保留英文枚举，避免前后端契约被展示文案污染。
 */
function statusLabel(status: string) {
  const labels: Record<string, string> = {
    // pending 表示任务还没开始。
    pending: "等待中",
    // running 表示任务正在执行。
    running: "生成中",
    // succeeded 表示任务成功完成。
    succeeded: "已完成",
    // failed 表示任务失败。
    failed: "失败"
  };

  return labels[status] ?? status;
}

/**
 * AssetsPanel 是右侧素材面板。
 *
 * 数据来自 asset.schema.json 对应的 mockAssets。
 * 后续联调 GET /api/assets 后，字段名称必须继续保持一致。
 */
function AssetsPanel() {
  return (
    <div className="space-y-2 p-3">
      {mockAssets.map((asset) => (
        <article key={asset.assetId} className="rounded-2xl px-3 py-3 transition hover:bg-[#f0f0ee]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">{asset.title}</div>
              <div className="mt-1 text-xs text-muted">{assetTypeLabel(asset.type)}</div>
            </div>
            <span className="rounded-full bg-panel px-2.5 py-1 text-xs ring-1 ring-[#eeeeea]">
              {statusLabel(asset.status)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">{asset.description}</p>
        </article>
      ))}
    </div>
  );
}

/**
 * WorkflowPanel 是右侧工作流 / Trace 面板。
 *
 * 这里展示 trace.schema.json 的核心字段。
 * 后续接 SSE 时，需要把流式事件和历史 trace 合并成同一条 timeline。
 */
function WorkflowPanel() {
  return (
    <div className="space-y-2 p-3">
      {mockTraceEvents.map((event) => (
        <article key={event.eventId} className="rounded-2xl px-3 py-3 transition hover:bg-[#f0f0ee]">
          <div className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 rounded-full bg-ink" />
            <div>
              <div className="text-sm font-semibold">{event.title}</div>
              <p className="mt-1 text-sm leading-6 text-muted">{event.detail}</p>
              <div className="mt-2 text-xs text-muted">{event.durationMs} 毫秒</div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

/**
 * HtmlPanel 是右侧 HTML 预览面板。
 *
 * Phase 1.7 只展示 mock HTML 片段。
 * 后续真实预览必须使用隔离渲染策略，避免生成的 HTML 污染主应用 DOM。
 */
function HtmlPanel() {
  return (
    <div className="p-4">
      <div className="rounded-2xl bg-neutral-50 p-4 ring-1 ring-[#eeeeea]">
        <div className="text-xs text-muted">网页预览</div>
        <h2 className="mt-4 text-xl font-semibold">夏日气泡咖啡</h2>
        <p className="mt-2 text-sm leading-6 text-muted">清爽上市，适合午后、通勤和轻运动后的第一杯冰咖啡。</p>
        <button className="mt-5 rounded-full bg-ink px-4 py-2 text-sm text-white">查看门店券</button>
      </div>
      <pre className="mt-4 overflow-auto rounded-2xl bg-panel p-3 text-xs leading-5 text-muted ring-1 ring-[#eeeeea]">
        {mockAssets.find((asset) => asset.type === "html")?.htmlSnippet}
      </pre>
    </div>
  );
}

/**
 * ExportPanel 是右侧导出面板。
 *
 * Phase 1 只做交付包概念展示，后续再接对象存储、异步任务和下载地址。
 */
function ExportPanel() {
  return (
    <div className="p-4">
      <div className="rounded-2xl bg-panel p-4 ring-1 ring-[#eeeeea]">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Download size={16} />
          导出交付包
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">
          将图片、视频分镜、网页片段、合规报告和追踪摘要打包，方便后续面试讲解和真实项目复盘。
        </p>
        <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-3 py-2 text-sm text-white">
          <PackageCheck size={16} />
          生成模拟交付包
        </button>
      </div>
    </div>
  );
}

/**
 * CanvasIntroPanel 是普通右侧面板里的画板入口。
 *
 * 真正的画板编辑态不在这里渲染，而由父级舞台切换到 CanvasPane。
 */
function CanvasIntroPanel({
  onOpen
}: {
  /** onOpen 负责从普通详情态进入画板编辑态。 */
  onOpen: () => void;
}) {
  return (
    <div className="p-4">
      <button className="w-full rounded-full bg-ink px-4 py-3 text-sm text-white" onClick={onOpen}>
        进入全屏画板
      </button>
    </div>
  );
}
