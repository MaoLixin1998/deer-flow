import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/shared/lib/cn";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** label 是给无障碍和悬浮提示使用的中文动作名称，页面不能出现英文按钮说明。 */
  label: string;
  /** children 是真正展示的图标，避免再用文字或色块假装图标。 */
  children: ReactNode;
  /** active 表示当前能力入口是否被选中，选中态使用黑底白图标。 */
  active?: boolean;
};

/**
 * 统一图标按钮。
 *
 * 用户之前明确指出不能用文字或黑块假装 icon。
 * 所以前端所有工具动作都走这个组件，并强制传入中文 label 作为 aria-label / title。
 */
export function IconButton({ label, children, active, className, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-md border transition disabled:cursor-not-allowed disabled:opacity-50",
        className,
        active ? "border-ink bg-ink text-white hover:bg-ink" : "border-line bg-panel text-ink hover:bg-neutral-100",
      )}
      {...props}
    >
      {children}
    </button>
  );
}
