import type { GameObj } from "kaplay";
import { roundToDecimal } from "../lib/round-to-decimal";
import { HoldButton } from "./hold-button";
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
      <HoldButton className="ki-btn" onClickAndHold={() => (obj.pos.x -= 1)}>
        <ArrowLeftIcon />
      </HoldButton>
      <HoldButton className="ki-btn" onClickAndHold={() => (obj.pos.x += 1)}>
        <ArrowRightIcon />
      </HoldButton>
      <div class="pos-controls__value">x: {roundToDecimal(obj.pos.x, 2)}</div>
      <div class="pos-controls__value">y: {roundToDecimal(obj.pos.y, 2)}</div>

      <HoldButton className="ki-btn" onClickAndHold={() => (obj.pos.y -= 1)}>
        <ArrowUpIcon />
      </HoldButton>
      <HoldButton className="ki-btn" onClickAndHold={() => (obj.pos.y += 1)}>
        <ArrowDownIcon />
      </HoldButton>
    </div>
  );
};
