import { cx } from "../../lib/cx";

export interface BlendControlProps {
  obj: Record<string, any>;
  className?: string;
}

const MODES = [
  { label: "normal", value: 0 },
  { label: "add", value: 1 },
  { label: "multiply", value: 2 },
  { label: "screen", value: 3 },
  { label: "overlay", value: 4 },
];

export const BlendControl = ({ className = "", obj }: BlendControlProps) => {
  return (
    <div class={cx(className, "ki-blend-control")}>
      {MODES.map((mode) => (
        <label key={mode.value} class="ki-flex">
          <input
            type="radio"
            name={`blend-${obj.id}`}
            value={mode.value}
            checked={obj.blend === mode.value}
            onChange={() => (obj.blend = mode.value)}
          />
          {mode.label}
        </label>
      ))}
    </div>
  );
};
