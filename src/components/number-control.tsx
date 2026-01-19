import { NumberInput } from "./number-input";

export interface NumberControlProps {
  obj: Record<string, any>;
  property: string;
  className?: string;
  step?: number;
}

export const NumberControl = ({
  className = "",
  obj,
  property,
  step,
}: NumberControlProps) => {
  return (
    <NumberInput
      className={className}
      obj={obj}
      property={property}
      onChange={(n) => {
        obj[property] = n;
      }}
      step={step}
    />
  );
};
