import type { JSX } from "preact/jsx-runtime";
import type { TargetedFocusEvent, TargetedPointerEvent } from "preact";
import { cx } from "../../lib/cx";
import { useCallback, useRef } from "preact/hooks";

interface IconButtonProps {
  id?: string;
  className?: string;
  tooltip: string;
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
  const ref = useRef<HTMLSpanElement>(null);

  const hideTooltip = useCallback(() => {
    if (ref.current && ref.current.matches(":popover-open")) {
      ref.current.hidePopover();
    }
  }, []);

  const handlePointerEnter = useCallback(
    (event: TargetedPointerEvent<HTMLButtonElement>) => {
      if (
        event.pointerType === "mouse" &&
        ref.current &&
        !ref.current.matches(":popover-open")
      ) {
        ref.current.showPopover();
      }
    },
    [],
  );

  const handleFocus = useCallback(
    (event: TargetedFocusEvent<HTMLButtonElement>) => {
      if (
        event.currentTarget.matches(":focus-visible") &&
        ref.current &&
        !ref.current.matches(":popover-open")
      ) {
        ref.current.showPopover();
      }
    },
    [],
  );

  return (
    <button
      {...props}
      type="button"
      class={cx("ki-icon-btn", className)}
      aria-label={tooltip}
      onClick={onClick}
      disabled={disabled}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={hideTooltip}
      onFocus={handleFocus}
      onBlur={hideTooltip}
    >
      {children}

      <span ref={ref} popover="manual" class="ki-tooltip">
        {tooltip}
      </span>
    </button>
  );
};
