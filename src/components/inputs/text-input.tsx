import type { TargetedInputEvent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { cx } from "../../lib/cx";

export interface TextInputProps {
  className?: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const TextInput = ({
  className = "",
  value,
  onChange,
  placeholder = "",
}: TextInputProps) => {
  const [localValue, setLocalValue] = useState<string>(value.toString());
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Sync game state -> UI when input is not focused
  useEffect(() => {
    if (!isFocused) {
      setLocalValue(value.toString());
    }
  }, [value, isFocused]);

  if (value === undefined) {
    return null;
  }

  const handleInput = (e: TargetedInputEvent<HTMLTextAreaElement>) => {
    const value = (e.target as HTMLTextAreaElement).value;
    setLocalValue(value);
    onChange(value);
  };

  return (
    <textarea
      class={cx(className, "text-input ki-input")}
      value={localValue}
      onInput={handleInput}
      placeholder={placeholder}
      onFocus={() => setIsFocused(true)}
      onBlur={() => {
        setIsFocused(false);
        // Final sync to ensure value is in sync
        setLocalValue(value);
      }}
    />
  );
};
