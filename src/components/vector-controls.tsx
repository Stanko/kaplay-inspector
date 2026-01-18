import type { Vec2 } from "kaplay";
import { roundToDecimal } from "../lib/round-to-decimal";
import { HoldButton } from "./hold-button";
import {
  ArrowDownIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
} from "./icons";
import { k } from "../k";
import { cx } from "../lib/cx";

export interface VectorControlsProps {
  className?: string;
  value: Vec2;
  onChange: (v: Vec2) => void;
  step?: number;
}

export const VectorControls = ({
  className = "",
  value,
  onChange,
  step = 1,
}: VectorControlsProps) => {
  return (
    <div class={cx(className, "vector-controls")}>
      <HoldButton
        className="ki-btn"
        onClickAndHold={() => onChange(k.vec2(value.x - step, value.y))}
      >
        <ArrowLeftIcon />
      </HoldButton>
      <HoldButton
        className="ki-btn"
        onClickAndHold={() => onChange(k.vec2(value.x + step, value.y))}
      >
        <ArrowRightIcon />
      </HoldButton>
      <div class="vector-controls__value">x: {roundToDecimal(value.x, 2)}</div>
      <div class="vector-controls__value">y: {roundToDecimal(value.y, 2)}</div>

      <HoldButton
        className="ki-btn"
        onClickAndHold={() => onChange(k.vec2(value.x, value.y - step))}
      >
        <ArrowUpIcon />
      </HoldButton>
      <HoldButton
        className="ki-btn"
        onClickAndHold={() => onChange(k.vec2(value.x, value.y + step))}
      >
        <ArrowDownIcon />
      </HoldButton>
    </div>
  );
};
