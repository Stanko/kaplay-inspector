import type { KAPLAYCtxT } from "kaplay";
import { useEffect, useState } from "preact/hooks";
import type { InspectorOptions } from "../init";
import { GameObject } from "./game-object";

export interface InspectorProps extends InspectorOptions {
  k: KAPLAYCtxT;
}

export const Inspector = ({ updateTimeout = 250, k }: InspectorProps) => {
  const [root, setRoot] = useState(k.getTreeRoot());
  const [renderIndex, setRenderIndex] = useState(0);

  // Force re-render every updateTimeout milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderIndex(renderIndex + 1);
    }, updateTimeout);

    return () => clearInterval(interval);
  }, [renderIndex, updateTimeout]);

  const handlePauseClick = () => {
    const root = k.getTreeRoot();
    root.paused = !root.paused;
  };

  return (
    <>
      <div class="k-inspector__header">
        <button class="ki-btn" onClick={handlePauseClick}>
          Pause/Resume
        </button>
        &bull;
        <div>{k.get("*", { recursive: true }).length} objects</div>
        &bull;
        <div>{Math.round(k.debug.fps())} fps</div>
      </div>

      <div class="k-inspector__objects">
        <GameObject
          k={k}
          className="game-object--root"
          obj={root}
          setRenderRoot={setRoot}
          isExpanded
          isRenderRoot
        />
      </div>
    </>
  );
};
