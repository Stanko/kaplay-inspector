import type { GameObj } from "kaplay";
import { roundToDecimal } from "../lib/round-to-decimal";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "./icons";

export interface PositionControlsProps {
  className?: string;
  obj: GameObj;
}

export const PositionControls = ({ obj }: PositionControlsProps) => {
  if (!obj.pos) {
    return null;
  }

  return (
    <div class="pos-controls">
      <button class="btn" onClick={() => (obj.pos.x -= 1)}>
        <ArrowLeftIcon />
      </button>
      <button class="btn" onClick={() => (obj.pos.x += 1)}>
        <ArrowRightIcon />
      </button>
      <div class="pos-controls__value">x: {roundToDecimal(obj.pos.x, 2)}</div>
      <div class="pos-controls__value">y: {roundToDecimal(obj.pos.y, 2)}</div>

      <button class="btn" onClick={() => (obj.pos.y -= 1)}>
        <ArrowUpIcon />
      </button>
      <button class="btn" onClick={() => (obj.pos.y += 1)}>
        <ArrowDownIcon />
      </button>
    </div>
  );
};
