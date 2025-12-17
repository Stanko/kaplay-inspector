import { useEffect, useState } from "preact/hooks";
import type { InspectorOptions, KAPLAYCtxType } from "../init";
import { GameObject } from "./game-object";

export interface InspectorProps extends InspectorOptions {
  k: KAPLAYCtxType;
}

const INTERVAL_OPTIONS = [
  { value: 100, label: "100ms" },
  { value: 250, label: "250ms" },
  { value: 500, label: "500ms" },
  { value: 1000, label: "1s" },
];

export const Inspector = ({
  initUpdateTimeout = 250,
  isVisibleOnLoad = true,
  initDrawInspectOnHover = true,
  k,
}: InspectorProps) => {
  const [updateTimeout, setUpdateTimeout] = useState(initUpdateTimeout);
  const [shouldDrawInspect, setShouldDrawInspect] = useState(
    initDrawInspectOnHover,
  );
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
        &bull;
        <div class="k-inspector__interval">
          Update:
          {INTERVAL_OPTIONS.map((option) => (
            <label key={option.value}>
              <input
                type="radio"
                name="interval"
                value={option.value}
                checked={updateTimeout === option.value}
                onChange={() => setUpdateTimeout(option.value)}
              />
              {option.label}
            </label>
          ))}
        </div>
        &bull;
        <label>
          <input
            type="checkbox"
            checked={shouldDrawInspect}
            onChange={() => setShouldDrawInspect(!shouldDrawInspect)}
          />
          Draw bbox on hover
        </label>
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
          shouldDrawInspect={shouldDrawInspect}
          isExpanded
          isRenderRoot
        />
      </div>
    </>
  );
};
