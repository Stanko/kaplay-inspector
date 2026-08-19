import type { JSX } from "preact/jsx-runtime";
import { cx } from "../../lib/cx";

interface ToolbarButtonProps {
  className?: string;
  tooltip?: string;
  children: JSX.Element | string;
  onClick?: () => void;
}

export const ToolbarButton = ({
  tooltip,
  children,
  onClick,
  className = "",
}: ToolbarButtonProps) => {
  return (
    <button class={cx("ki-btn", "ki-toolbar-btn", className)} onClick={onClick}>
      {children}
      {tooltip && <span class="ki-toolbar-btn__tooltip">{tooltip}</span>}
    </button>
  );
};
