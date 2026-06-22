import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/cn";

/**
 * PlanStep 是输入框上方“规划帽子”里的一条智能体阶段。
 *
 * 这里单独抽类型，是为了让 Java 开发者能一眼看懂：
 * 这个组件不是普通 UI 装饰，而是在表达 Agent Loop 的阶段状态。
 */
export type PlanStep = {
  /** title 是阶段标题，例如“规划 / 执行 / 观察 / 复盘”。 */
  title: string;
  /** description 是阶段说明，用来解释当前阶段具体做什么。 */
  description: string;
  /** done 表示这个阶段是否完成，完成项展示黑底白勾。 */
  done: boolean;
};

/**
 * PlanningHatProps 是规划帽子的外部入参。
 *
 * 这些字段都由父级 ConversationPane 控制，避免组件内部偷偷影响消息区高度。
 */
type PlanningHatProps = {
  /** open 表示帽子是否展开为竖向待办列表。 */
  open: boolean;
  /** steps 是当前智能体计划步骤，后续会从 SSE planner 事件归约得到。 */
  steps: PlanStep[];
  /** onToggle 负责展开或收起帽子，由父组件同步调整消息区底部 padding。 */
  onToggle: () => void;
};

/**
 * PlanningHat 是输入框上方的“当前智能体计划”组件。
 *
 * 关键交互规则：
 * 1. 收起态只展示“01 规划”。
 * 2. 展开态必须是竖排待办列表，不允许改回横排卡片。
 * 3. 列表保留滚动能力，但隐藏滚动条和硬分割线。
 */
export function PlanningHat({ open, steps, onToggle }: PlanningHatProps) {
  return (
    <div
      className={cn(
        "absolute left-8 right-8 z-0 rounded-t-[28px] bg-panel ring-1 ring-[#e5e5e1] transition-[height,top] duration-300",
        open ? "-top-40 h-44" : "-top-12 h-16"
      )}
    >
      <button
        className="flex h-12 w-full items-center justify-between px-5 text-left text-sm text-muted outline-none focus-visible:ring-2 focus-visible:ring-[#d8d8d2]"
        onClick={onToggle}
      >
        <span className="font-medium text-ink">01 规划</span>
        <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        /*
         * 展开列表必须保持紧凑：
         * - 每条任务只占一行。
         * - 说明文字用 truncate，避免撑高帽子。
         * - 超过可视高度时滚动，但不显示滚动条。
         */
        <div className="scrollbar-hide mx-5 max-h-[108px] overflow-y-auto pb-3 pr-1 text-sm">
          <div>
            {steps.map((step, index) => (
              <div key={step.title} className="flex h-9 min-w-0 items-center gap-2 px-1">
                {/* 状态图标：完成是黑底白勾，未完成是空框。 */}
                <span
                  className={cn(
                    "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] ring-1",
                    step.done ? "bg-ink text-white ring-ink" : "bg-panel ring-[#d8d8d2]"
                  )}
                >
                  {step.done && <Check size={11} />}
                </span>
                {/* 任务正文：编号、标题和说明压成同一行，避免展开区过高。 */}
                <span className="shrink-0 text-xs text-muted">0{index + 1}</span>
                <span className="shrink-0 text-sm font-medium text-ink">{step.title}</span>
                <span className="min-w-0 truncate text-xs text-muted">{step.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
