import { cx } from "../lib/cx";
import { NumberInput } from "./number-input";
import { useApp } from "../lib/app-context";

export interface VectorControlProps {
  className?: string;
  obj: Record<string, any>;
  property: string;
  step?: number;
  // This is primarily for pos/scale/skew,
  // because kaplay doesn't needs a whole new object to update these properties
  // It is already fixed in Kaplay, but it is not yet released
  // TODO: remove inPlace prop when it is changed in Kaplay
  inPlace?: boolean;
}

export const VectorControl = ({
  className = "",
  obj,
  property,
  step,
  inPlace = false,
}: VectorControlProps) => {
  const { k } = useApp();

  if (obj[property] === undefined) {
    return null;
  }

  return (
    <div className={cx(className, "vector-control ki-flex")}>
      x:{" "}
      <NumberInput
        className="vector-control__x-input"
        obj={obj[property]}
        property="x"
        onChange={(x) => {
          if (inPlace) {
            obj[property].x = x;
          } else {
            obj[property] = k.vec2(x, obj[property].y);
          }
        }}
        step={step}
      />
      y:{" "}
      <NumberInput
        obj={obj[property]}
        property="y"
        onChange={(y) => {
          if (inPlace) {
            obj[property].y = y;
          } else {
            obj[property] = k.vec2(obj[property].x, y);
          }
        }}
        step={step}
      />
    </div>
  );
};
