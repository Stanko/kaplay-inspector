import type { GameObj } from "kaplay";
import { NumberInput } from "../inputs/number-input";

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
      <NumberInput
        className={className}
        obj={obj}
        property="hp"
        step={step}
        onChange={(n) => {
          obj.hp = n;
        }}
      />{" "}
      (Max: {obj.maxHP})
    </div>
  );
};
