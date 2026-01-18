import type { GameObj } from "kaplay";
import { VectorControls } from "./vector-controls";

export interface PositionControlsProps {
  className?: string;
  obj: GameObj;
}

export const PositionControls = ({
  className = "",
  obj,
}: PositionControlsProps) => {
  if (!obj.pos) {
    return null;
  }

  return (
    <VectorControls
      className={className}
      value={obj.pos}
      onChange={(pos) => (obj.pos = pos)}
    />
  );
};
