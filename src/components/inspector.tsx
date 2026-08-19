import { useEffect, useMemo, useState } from "preact/hooks";
import { GameObject } from "./game-object";
import { useObjectBoolean } from "./boolean-comp";
import { SearchResults } from "./search-results";
import { Recorder } from "./recorder";
import { getFpsColor } from "../lib/get-fps-color";
import { InspectorContext } from "./inspector-context";
import { useInspectOverlay } from "../hooks/use-inspect-overlay";
import { useMouseInspect } from "../hooks/use-mouse-inspect";
import { Textures } from "./textures";
import { useApp } from "../lib/app-context";
import { DrawBBox } from "./draw-bb-box";
import { Search } from "./search";

const INTERVAL_OPTIONS = [
  { value: 100, label: "100ms" },
  { value: 250, label: "250ms" },
  { value: 500, label: "500ms" },
  { value: 1000, label: "1s" },
];

export const Inspector = () => {
  const {
    k,
    root,
    setRoot,
    isDrawBBoxActive,
    isVisible,
    toggleVisibility,
    searchResults,
    searchQuery,
  } = useApp();

  // Update timeout and force re-render
  const [updateTimeout, setUpdateTimeout] = useState(250);
  const [renderIndex, setRenderIndex] = useState(0);

  const { setInspectObject, clearInspectObject } = useInspectOverlay(
    k,
    isDrawBBoxActive,
  );

  // Mouse click inspecting
  const { shouldMouseInspect, setShouldMouseInspect } = useMouseInspect(
    k,
    setInspectObject,
    setRoot,
  );

  // Game root paused state
  const paused = useObjectBoolean(k.getTreeRoot(), "paused");

  // Force re-render every updateTimeout milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderIndex(renderIndex + 1);
    }, updateTimeout);

    return () => clearInterval(interval);
  }, [renderIndex, updateTimeout]);

  const contextValue = useMemo(
    () => ({
      k,
      setRoot,
      setInspectObject,
      clearInspectObject,
    }),
    [k, setRoot, setInspectObject, clearInspectObject],
  );

  if (!isVisible) {
    return (
      <button class="ki-btn k-inspector__show" onClick={toggleVisibility}>
        Show Inspector
      </button>
    );
  }

  const fps = Math.round(k.debug.fps());
  const fpsColor = getFpsColor(fps);

  return (
    <InspectorContext.Provider value={contextValue}>
      <div class="k-inspector__header">
        <button class="ki-btn" onClick={() => paused.onChange(!paused.checked)}>
          {paused.checked ? "Resume Game" : "Pause Game"}
        </button>
        <div class="ki-separator" />
        <Search />
        <div class="ki-separator" />
        <div>{k.get("*", { recursive: true }).length} objects</div>
        <div class="ki-separator" />
        <div class={fpsColor}>{fps} fps</div>
        <div class="ki-separator" />
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
        <div class="ki-separator" />
        <DrawBBox disabled={shouldMouseInspect} />
        <div class="ki-separator" />
        <label>
          <input
            type="checkbox"
            checked={shouldMouseInspect}
            onChange={() => setShouldMouseInspect(!shouldMouseInspect)}
          />
          Mouse inspect
        </label>
        <div class="ki-separator" />
        <Recorder />
        <Textures />
        <button class="ki-btn k-inspector__hide" onClick={toggleVisibility}>
          Hide
        </button>
      </div>

      <div class="k-inspector__objects">
        {searchQuery.length > 0 ? (
          <SearchResults results={searchResults} />
        ) : (
          <GameObject
            className="game-object--root"
            obj={root}
            isExpanded
            isRenderRoot
          />
        )}
      </div>
    </InspectorContext.Provider>
  );
};
