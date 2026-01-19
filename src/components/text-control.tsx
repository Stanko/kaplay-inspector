import type { GameObj } from "kaplay";
import { TextInput } from "./text-input";

export interface TextControlProps {
  className?: string;
  obj: GameObj;
}

export const TextControl = ({ obj }: TextControlProps) => {
  if (typeof obj.text !== "string") {
    return null;
  }

  return (
    <div class="text-control">
      <TextInput
        className="text-control__input ki-input"
        placeholder="Enter text"
        value={obj.text}
        onChange={(text) => (obj.text = text)}
      />
    </div>
  );
};
