import type { GameObj } from "kaplay";
import { NumberControl } from "./number-control";

export interface HpControlProps {
  className?: string;
  obj: GameObj;
  step?: number;
}

export const HpControl = ({ className = "", obj, step }: HpControlProps) => {
  if (obj.hp === undefined) {
    return null;
  }

  return (
    <div class="hp-control ki-flex">
      <NumberControl
        className={className}
        obj={obj}
        property="hp"
        step={step}
      />{" "}
      (Max: {obj.maxHP})
    </div>
  );
};
