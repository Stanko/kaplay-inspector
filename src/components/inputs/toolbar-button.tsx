import type { JSX } from "preact/jsx-runtime";
import { cx } from "../../lib/cx";

interface ToolbarButtonProps {
  className?: string;
  tooltip?: string;
  children: JSX.Element | string;
  onClick?: () => void;
  disabled?: boolean;
}

export const ToolbarButton = ({
  tooltip,
  children,
  onClick,
  className = "",
  disabled = false,
}: ToolbarButtonProps) => {
  return (
    <button
      class={cx("ki-toolbar-btn", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {tooltip && <span class="ki-toolbar-btn__tooltip">{tooltip}</span>}
    </button>
  );
};
