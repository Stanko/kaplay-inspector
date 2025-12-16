import type { KAPLAYCtx, KAPLAYCtxT } from "kaplay";
import { useEffect, useState } from "preact/hooks";
import type { InspectorOptions } from "../init";
import { GameObject } from "./game-object";

export interface InspectorProps extends InspectorOptions {
  k: KAPLAYCtx | KAPLAYCtxT;
}

export const Inspector = ({
  updateTimeout = 250,
  isVisibleOnLoad = true,
  k,
}: InspectorProps) => {
  const [root, setRoot] = useState(k.getTreeRoot());
  const [renderIndex, setRenderIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(isVisibleOnLoad);

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

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!isVisible) {
    return (
      <button class="ki-btn k-inspector__show" onClick={toggleVisibility}>
        Show Inspector
      </button>
    );
  }

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
        <button class="ki-btn k-inspector__hide" onClick={toggleVisibility}>
          Hide
        </button>
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
