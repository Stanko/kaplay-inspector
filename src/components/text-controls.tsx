import type { GameObj } from "kaplay";

export interface TextControlsProps {
  className?: string;
  obj: GameObj;
}

export const TextControls = ({ obj }: TextControlsProps) => {
  if (typeof obj.text !== "string") {
    return null;
  }

  const handleInput = (e: Event) => {
    obj.text = (e.target as HTMLInputElement).value;
  };

  return (
    <div class="text-controls">
      <textarea
        class="text-controls__input ki-input"
        placeholder="Enter text"
        value={obj.text}
        onInput={handleInput}
      />
    </div>
  );
};
