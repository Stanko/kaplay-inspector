import { cx } from "../lib/cx";
import { NumberInput } from "./number-input";
import { k } from "../k";

export interface VectorControlProps {
  className?: string;
  obj: Record<string, any>;
  property: string;
  step?: number;
}

export const VectorControl = ({
  className = "",
  obj,
  property,
  step,
}: VectorControlProps) => {
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
        onChange={(x) => (obj[property] = k.vec2(x, obj[property].y))}
        step={step}
      />
      y:{" "}
      <NumberInput
        obj={obj[property]}
        property="y"
        onChange={(y) => (obj[property] = k.vec2(obj[property].x, y))}
        step={step}
      />
    </div>
  );
};
