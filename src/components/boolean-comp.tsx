import type { GameObj } from "kaplay";
import { useEffect, useState } from "preact/hooks";

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

export const BooleanComp = ({ obj, propName }: CheckboxCompProps) => {
  const id = `${propName}-${obj.id}`;
  const { checked, onChange } = useObjectBoolean(obj, propName);

  return (
    <div class="game-object__comps-row">
      <label for={id}>
        <b>{propName}</b>
      </label>
      <div>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
        />
      </div>
    </div>
  );
};
