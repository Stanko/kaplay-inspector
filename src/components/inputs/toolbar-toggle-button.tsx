import type { JSX } from "preact/jsx-runtime";
import { cx } from "../../lib/cx";
import { ToolbarButton } from "./toolbar-button";

interface ToolbarButtonToggleProps {
  className?: string;
  tooltip?: string;
  children: JSX.Element | string;
  onChange?: (checked: boolean) => void;
  checked?: boolean;
  disabled?: boolean;
}

export const ToolbarButtonToggle = ({
  tooltip,
  children,
  onChange,
  className = "",
  checked,
  disabled = false,
}: ToolbarButtonToggleProps) => {
  return (
    <ToolbarButton
      disabled={disabled}
      className={cx("ki-toolbar-toggle-btn", className, {
        "ki-toolbar-toggle-btn--checked": checked,
      })}
      onClick={() => {
        onChange?.(!checked);
      }}
      tooltip={tooltip}
    >
      {children}
    </ToolbarButton>
  );
};
