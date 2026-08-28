import type { JSX } from "preact/jsx-runtime";
import { cx } from "../../lib/cx";
import { IconButton } from "./toolbar-button";

interface IconToggleButtonProps {
  className?: string;
  tooltip?: string;
  children: JSX.Element | string | number | (JSX.Element | string | number)[];
  onChange: (checked: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

export const IconToggleButton = ({
  tooltip,
  children,
  onChange,
  className = "",
  checked,
  disabled = false,
}: IconToggleButtonProps) => {
  return (
    <IconButton
      disabled={disabled}
      className={cx("ki-icon-btn", className, {
        "ki-icon-btn--checked": checked,
      })}
      onClick={() => {
        onChange(!checked);
      }}
      tooltip={tooltip}
    >
      {children}
    </IconButton>
  );
};
