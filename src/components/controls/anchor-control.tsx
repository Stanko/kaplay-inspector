import type { GameObj, AnchorComp } from "kaplay";
import { cx } from "../../lib/cx";
import { VectorControl } from "./vector-control";
import { useApp } from "../../lib/app-context";

export interface AnchorControlProps {
  className?: string;
  obj: GameObj;
}

const strings = [
  ["topleft", "top", "topright"],
  ["left", "center", "right"],
  ["botleft", "bot", "botright"],
] as const;

export const AnchorControl = ({ className = "", obj }: AnchorControlProps) => {
  const { k } = useApp();
  const object = obj as GameObj<AnchorComp>;

  const isString = typeof obj.anchor === "string";

  return (
    <div class={cx(className, "anchor-control")}>
      {isString ? (
        <>
          <div class="anchor-radios">
            {strings.map((row, i) => {
              return (
                <div key={i} class="anchor-row">
                  {row.map((anchor) => {
                    return (
                      <label key={anchor}>
                        <input
                          type="radio"
                          name={`anchor-${obj.id}`}
                          value={anchor}
                          checked={anchor === object.anchor}
                          onChange={() => (object.anchor = anchor)}
                        />
                      </label>
                    );
                  })}
                </div>
              );
            })}

            <div>{isString && object.anchor}</div>
          </div>
          <button class="ki-btn" onClick={() => (object.anchor = k.vec2(0, 0))}>
            Use a vector
          </button>
        </>
      ) : (
        <>
          <VectorControl obj={obj} property="anchor" step={0.1} />
          <button class="ki-btn" onClick={() => (object.anchor = "center")}>
            Use a named location
          </button>
        </>
      )}
    </div>
  );
};
