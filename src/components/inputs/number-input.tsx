import type { TargetedInputEvent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { cx } from "../../lib/cx";
import { toFixed } from "../../lib/to-fixed";
import { HoldButton } from "./hold-button";

export interface NumberInputProps {
  obj: Record<string, any>;
  property: string;
  onChange: (value: number) => void;
  className?: string;
  step?: number;
}

export const NumberInput = ({
  obj,
  property,
  className = "",
  onChange,
  step = 1,
}: NumberInputProps) => {
  const [localValue, setLocalValue] = useState<string>(
    toFixed(obj[property]).toString(),
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  // Sync game state -> UI when input is not focused
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(toFixed(obj[property]).toString());
    }
  }, [obj[property], isFocused]);

  // Has to be after hooks
  if (typeof obj[property] !== "number") {
    return null;
  }

  const handleInput = (e: TargetedInputEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value;

    setLocalValue(value);

    const parsedValue = parseFloat(value);

    if (!isNaN(value as any) && !Number.isNaN(parsedValue)) {
      // Sync UI -> game state
      onChange(parsedValue);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleClickAndHold = (offset: number) => {
    // Use local value so we don't wait for the inspector to re-render
    const newValue = parseFloat(localValue) + offset;

    // obj[property] = newValue;
    onChange(newValue);
    setLocalValue(toFixed(newValue).toString());
  };

  return (
    <div class={cx(className, "ki-number-input ki-flex")}>
      <HoldButton
        className="ki-btn"
        onClickAndHold={() => handleClickAndHold(-step)}
        onHoldEnd={() => {
          // Final sync to ensure value is in sync
          setLocalValue(toFixed(obj[property]).toString());
        }}
      >
        -
      </HoldButton>
      <input
        class={cx("ki-input", {
          "ki-input--error": error,
        })}
        type="number"
        value={localValue}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          setError(false);
          // Final sync to ensure value is in sync
          setLocalValue(toFixed(obj[property]).toString());
        }}
      />
      <HoldButton
        className="ki-btn"
        onClickAndHold={() => handleClickAndHold(step)}
      >
        +
      </HoldButton>
    </div>
  );
};
