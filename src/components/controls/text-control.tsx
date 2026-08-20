import type { GameObj } from "kaplay";
import { TextInput } from "../inputs/text-input";

export interface TextControlProps {
  obj: GameObj;
  property?: string;
}

export const TextControl = ({ obj, property = "text" }: TextControlProps) => {
  if (typeof obj[property] !== "string") {
    return null;
  }

  return (
    <div class={"ki-text-control"}>
      <TextInput
        className="ki-text-control__input"
        placeholder="Enter text"
        value={obj[property]}
        onChange={(text) => (obj[property] = text)}
      />
    </div>
  );
};
