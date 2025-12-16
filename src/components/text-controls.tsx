import type { GameObj } from "kaplay";

export interface TextControlsProps {
  className?: string;
  obj: GameObj;
}

export const TextControls = ({ obj }: TextControlsProps) => {
  if (typeof obj.text !== "string") {
    return null;
  }

  return (
    <div class="text-controls">
      <input
        class="text-controls__input"
        type="text"
        placeholder="Enter text"
        defaultValue={obj.text}
        onInput={(e) => {
          obj.text = (e.target as HTMLInputElement).value;
        }}
      />
    </div>
  );
};
