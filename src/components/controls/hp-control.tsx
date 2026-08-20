import type { GameObj } from "kaplay";
import { NumberInput } from "../inputs/number-input";

export interface HpControlProps {
  obj: GameObj;
  step?: number;
}

export const HpControl = ({ obj, step }: HpControlProps) => {
  if (obj.hp === undefined) {
    return null;
  }

  return (
    <div class="hp-control ki-flex">
      <div>hp:</div>
      <NumberInput
        className="hp-control__hp-input"
        obj={obj}
        property="hp"
        step={step}
        onChange={(n) => {
          obj.hp = n;
        }}
      />{" "}
      <div>max hp:</div>
      <NumberInput
        obj={obj}
        property="maxHP"
        step={step}
        onChange={(n) => {
          obj.maxHP = n;
        }}
      />{" "}
    </div>
  );
};
