import { useEffect, useMemo, useState } from "preact/hooks";
import { GameObject } from "./game-object";
import { useObjectBoolean } from "./boolean-comp";
import { SearchResults } from "./search-results";
import { Recorder } from "./recorder";
import { getFpsColor } from "../lib/get-fps-color";
import { InspectorContext } from "./inspector-context";
import { useInspectOverlay } from "../hooks/use-inspect-overlay";
import { Textures } from "./textures";
import { useApp } from "../lib/app-context";
import { DrawBBox } from "./draw-bb-box";
import { Search } from "./search";
import { UpdateInterval } from "./update-interval";
import { MouseInspect } from "./mouse-inspect";

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
    updateInterval,
  } = useApp();

  const [, setRenderIndex] = useState(0);

  const { setInspectObject, clearInspectObject } = useInspectOverlay(
    k,
    isDrawBBoxActive,
  );

  // Game root paused state
  const paused = useObjectBoolean(k.getTreeRoot(), "paused");

  // Force re-render every updateInterval milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderIndex((index) => index + 1);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

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
        <UpdateInterval />
        <div class="ki-separator" />
        <DrawBBox />
        <div class="ki-separator" />
        <MouseInspect />
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
