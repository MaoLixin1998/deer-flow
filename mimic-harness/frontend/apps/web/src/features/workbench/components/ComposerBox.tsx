import { ArrowUp, ChevronDown, Mic, Plus, ShieldCheck } from "lucide-react";

/**
 * ComposerBoxProps 是底部创意需求输入框的外部入参。
 *
 * 这个组件只负责输入和按钮展示，不直接知道 SSE、Run 或后端地址。
 * 后续真实联调时，提交动作仍然由父级 use case 或 api-client 承接。
 */
type ComposerBoxProps = {
  /** brief 是当前输入框内的创意需求文本。 */
  brief: string;
  /** onBriefChange 负责把用户输入同步回父组件状态。 */
  onBriefChange: (value: string) => void;
  /** onSubmit 负责提交创意需求，后续会触发 run stream。 */
  onSubmit: () => void;
  /** onOpenCanvas 负责打开画板入口，当前也作为上传图片占位入口。 */
  onOpenCanvas: () => void;
};

/**
 * ComposerBox 是工作台底部输入框。
 *
 * 固化规则：
 * 1. 按钮全部在输入框内部。
 * 2. 左侧加号是图片上传占位。
 * 3. 右侧是语音和发送。
 * 4. 页面文案必须全中文。
 */
export function ComposerBox({ brief, onBriefChange, onSubmit, onOpenCanvas }: ComposerBoxProps) {
  return (
    <div className="relative z-10 rounded-[30px] bg-panel px-5 py-4 ring-1 ring-[#deded8]">
      <textarea
        value={brief}
        onChange={(event) => onBriefChange(event.target.value)}
        rows={4}
        className="min-h-24 w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-[#b0b0ad]"
        placeholder="要求后续变更"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* 上传图片入口改为左侧加号，后续可以接文件选择器。 */}
          <button
            aria-label="上传图片"
            title="上传图片"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted outline-none transition hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-[#d8d8d2]"
            onClick={onOpenCanvas}
          >
            <Plus size={24} />
          </button>
          {/* 当前模式提示保留在框内，模拟“智能体规划能力选择”。 */}
          <button className="inline-flex items-center gap-2 rounded-full px-2 py-2 text-sm font-medium text-[#2688ff] outline-none transition hover:bg-[#f3f8ff] focus-visible:ring-2 focus-visible:ring-[#d8d8d2]">
            <ShieldCheck size={18} />
            智能规划
            <ChevronDown size={14} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            aria-label="用语音输入创意需求"
            title="用语音输入创意需求"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted outline-none transition hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-[#d8d8d2]"
          >
            <Mic size={20} />
          </button>
          <button
            aria-label="发送创意需求"
            title="发送创意需求"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white outline-none transition hover:bg-black focus-visible:ring-2 focus-visible:ring-[#d8d8d2]"
            onClick={onSubmit}
          >
            <ArrowUp size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
