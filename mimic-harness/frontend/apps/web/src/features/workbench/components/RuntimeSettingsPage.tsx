import { ArrowLeft, CircleCheck, CircleDashed, Server } from "lucide-react";
import Link from "next/link";
import { mockRuntimes, mockToolCalls } from "@/features/workbench/model/mockData";

/**
 * RuntimeSettingsPage 是 Java / Python 双运行时的前端入口。
 *
 * 第一阶段只展示模拟状态：
 * - Java 运行时模拟“可用”。
 * - Python 运行时模拟“降级可用”。
 *
 * 后续联调时，这里会调用 GET /api/runtimes，并把用户选择写入前端运行配置。
 */
export function RuntimeSettingsPage() {
  return (
    <main className="relative min-h-screen bg-canvas px-6 py-8 text-ink">
      {/* 返回按钮：只展示图标，中文语义放在 aria-label 和 title。 */}
      <div className="absolute left-4 top-4">
        <Link
          href="/"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-panel shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:bg-neutral-100"
          aria-label="返回工作台"
          title="返回工作台"
        >
          <ArrowLeft size={17} />
        </Link>
      </div>

      <section className="mx-auto max-w-5xl pt-10">
        <div>
          <h1 className="text-2xl font-semibold">运行时设置</h1>
          <p className="mt-2 text-sm text-muted">双后端模拟运行时切换与降级状态</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 py-8 md:grid-cols-2">
        {mockRuntimes.map((runtime) => (
          /* 每张运行时卡片对应 runtime.schema.json 的一条模拟数据。 */
          <article key={runtime.runtime} className="rounded-2xl bg-panel p-5 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <Server size={20} />
                <div>
                  <h1 className="text-lg font-semibold">{runtime.serviceName}</h1>
                  <p className="mt-1 text-sm text-muted">{runtime.baseUrl}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-2 py-1 text-xs">
                {runtime.status === "online" ? <CircleCheck size={14} /> : <CircleDashed size={14} />}
                {runtimeStatusLabel(runtime.status)}
              </span>
            </div>
            <p className="mt-5 text-sm leading-6 text-muted">{runtime.message}</p>
            <div className="mt-4 rounded-2xl bg-neutral-50 p-3 text-xs text-muted">
              {/* 这里必须明确 mockMode，防止学习阶段误以为已经接入真实大模型。 */}
              模拟模式：{runtime.mockMode ? "开启" : "关闭"}。第一阶段不保存真实模型密钥，也不调用真实供应商。
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-5xl pb-8">
        <div className="overflow-hidden rounded-2xl bg-panel shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)]">
          <div className="px-4 py-3 text-sm font-semibold">模拟工具调用登记</div>
          <div className="space-y-1 p-2">
            {mockToolCalls.map((tool) => (
              /* 工具调用列表对应 tool.schema.json，是后续 AgentOps Trace 面板的调试素材。 */
              <div key={tool.toolCallId} className="grid gap-2 rounded-xl px-3 py-3 text-sm hover:bg-neutral-50 md:grid-cols-[180px_1fr_90px]">
                <div className="font-medium">{toolNameLabel(tool.toolName)}</div>
                <div className="text-muted">耗时 {tool.durationMs} 毫秒，输出素材 {String(tool.output.assetId)}</div>
                <div className="text-muted">{toolStatusLabel(tool.status)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function runtimeStatusLabel(status: string) {
  const labels: Record<string, string> = {
    online: "可用",
    offline: "离线",
    degraded: "降级可用"
  };

  return labels[status] ?? status;
}

function toolStatusLabel(status: string) {
  const labels: Record<string, string> = {
    pending: "等待中",
    running: "执行中",
    succeeded: "已完成",
    failed: "失败"
  };

  return labels[status] ?? status;
}

function toolNameLabel(toolName: string) {
  const labels: Record<string, string> = {
    image_generator: "图片生成工具",
    html_builder: "网页生成工具"
  };

  return labels[toolName] ?? toolName;
}
