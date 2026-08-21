import { useId } from "preact/hooks";
import type { JSX } from "preact/jsx-runtime";
import { cx } from "../../lib/cx";
import { IconButton } from "./toolbar-button";

interface DropdownItem {
  label: string;
  value: number;
}

interface DropdownProps {
  tooltip?: string;
  items: DropdownItem[];
  children: JSX.Element | string | number | (JSX.Element | string | number)[];
  onChange: (value: number) => void;
  selectedValue?: number;
}

export const Dropdown = ({
  items,
  children,
  onChange,
  tooltip,
  selectedValue,
}: DropdownProps) => {
  const dropdownId = useId();

  return (
    <>
      <IconButton
        popovertarget={dropdownId}
        aria-haspopup="true"
        tooltip={tooltip}
      >
        {children}
      </IconButton>

      <div id={dropdownId} popover="auto" class="ki-dropdown ki-dropdown--list">
        {items.map((item, index) => (
          <button
            class={cx("ki-dropdown-item", {
              "ki-dropdown-item--selected": item.value === selectedValue,
            })}
            key={index}
            popovertarget={dropdownId}
            popovertargetaction="hide"
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </>
  );
};
