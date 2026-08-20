import type { JSX } from "preact/jsx-runtime";
import { cx } from "../../lib/cx";

interface IconButtonProps {
  className?: string;
  tooltip?: string;
  children: JSX.Element | string | number | (JSX.Element | string | number)[];
  onClick?: () => void;
  disabled?: boolean;
  popovertarget?: string;
}

export const IconButton = ({
  tooltip,
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}: IconButtonProps) => {
  return (
    <button
      {...props}
      type="button"
      class={cx("ki-icon-btn", className)}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      {tooltip && <span class="ki-tooltip">{tooltip}</span>}
    </button>
  );
};
