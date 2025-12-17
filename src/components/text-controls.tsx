import type { GameObj } from "kaplay";
import { useEffect, useState } from "preact/hooks";

export interface TextControlsProps {
  className?: string;
  obj: GameObj;
}

export const TextControls = ({ obj }: TextControlsProps) => {
  const [text, setText] = useState(obj.text);

  useEffect(() => {
    setText(obj.text);
  }, [obj.text]);

  if (typeof obj.text !== "string") {
    return null;
  }

  const handleInput = (e: Event) => {
    obj.text = (e.target as HTMLInputElement).value;
    setText(text);
  };

  return (
    <div class="text-controls">
      <input
        class="text-controls__input"
        type="text"
        placeholder="Enter text"
        value={text}
        onInput={handleInput}
      />
    </div>
  );
};
