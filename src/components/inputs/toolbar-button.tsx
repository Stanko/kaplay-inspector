import type { JSX } from "preact/jsx-runtime";
import { cx } from "../../lib/cx";

interface ToolbarButtonProps {
  className?: string;
  tooltip?: string;
  children: JSX.Element | string | number | (JSX.Element | string | number)[];
  onClick?: () => void;
  disabled?: boolean;
  popovertarget?: string;
}

export const ToolbarButton = ({
  tooltip,
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}: ToolbarButtonProps) => {
  return (
    <button
      {...props}
      class={cx("ki-toolbar-btn", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {tooltip && <span class="ki-toolbar-btn__tooltip">{tooltip}</span>}
    </button>
  );
};
