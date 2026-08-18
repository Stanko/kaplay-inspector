import type { GameObj } from "kaplay";
import { useEffect, useState } from "preact/hooks";
import { cx } from "../lib/cx";

type CheckboxCompProps = {
  obj: GameObj;
  propName: string;
};

export const useObjectBoolean = (obj: GameObj, propName: string) => {
  const [checked, setChecked] = useState(obj[propName]);

  useEffect(() => {
    setChecked(obj[propName]);
  }, [obj[propName]]);

  const onChange = (checked: boolean) => {
    setChecked(checked);
    obj[propName] = checked;
  };

  return {
    checked,
    onChange,
  };
};

export interface BooleanControlProps {
  className?: string;
  id?: string;
  obj: GameObj;
  property: string;
}

export const BooleanControl = ({
  className = "",
  id,
  obj,
  property,
}: BooleanControlProps) => {
  const { checked, onChange } = useObjectBoolean(obj, property);

  return (
    <input
      class={cx(className, "boolean-control")}
      id={id}
      type="checkbox"
      aria-label={property}
      checked={checked}
      onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
    />
  );
};

export const BooleanComp = ({ obj, propName }: CheckboxCompProps) => {
  const id = `${propName}-${obj.id}`;

  return (
    <div class="game-object__comps-row">
      <label for={id}>
        <b>{propName}</b>
      </label>
      <div>
        <BooleanControl id={id} obj={obj} property={propName} />
      </div>
    </div>
  );
};
