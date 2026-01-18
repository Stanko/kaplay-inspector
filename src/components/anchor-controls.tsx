import type { GameObj, AnchorComp, Vec2 } from "kaplay";
import { cx } from "../lib/cx";
import { VectorControls } from "./vector-controls";
import { k } from "../k";

export interface AnchorControlsProps {
  className?: string;
  obj: GameObj;
}

const strings = [
  ["topleft", "top", "topright"],
  ["left", "center", "right"],
  ["botleft", "bot", "botright"],
] as const;

export const AnchorControls = ({
  className = "",
  obj,
}: AnchorControlsProps) => {
  const object = obj as GameObj<AnchorComp>;

  const isString = typeof obj.anchor === "string";

  return (
    <div class={cx(className, "anchor-controls")}>
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
                          name="anchor"
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
            Switch to vector
          </button>
        </>
      ) : (
        <>
          <VectorControls
            value={object.anchor as Vec2}
            onChange={(anchor) => (object.anchor = anchor)}
            step={0.05}
          />
          <button class="ki-btn" onClick={() => (object.anchor = "center")}>
            Switch to string
          </button>
        </>
      )}
    </div>
  );
};
