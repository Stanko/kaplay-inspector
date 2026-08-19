import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import type { InspectorOptions } from "../init";
import { GameObject } from "./game-object";
import { useObjectBoolean } from "./boolean-comp";
import type { GameObj } from "kaplay";
import { SearchResults } from "./search-results";
import { Recorder } from "./recorder";
import { getFpsColor } from "../lib/get-fps-color";
import { InspectorContext } from "./inspector-context";
import type { KAPLAYCtxType } from "../kaplay";
import { useInspectOverlay } from "../hooks/use-inspect-overlay";
import { LS_SEARCH_QUERY, useObjectSearch } from "../hooks/use-object-search";
import { useMouseInspect } from "../hooks/use-mouse-inspect";

export interface InspectorProps extends InspectorOptions {
  k: KAPLAYCtxType;
}

const INTERVAL_OPTIONS = [
  { value: 100, label: "100ms" },
  { value: 250, label: "250ms" },
  { value: 500, label: "500ms" },
  { value: 1000, label: "1s" },
];

const LS_VISIBLE_STATE = "ki__is-visible";

export const Inspector = ({
  k,
  initUpdateTimeout = 250,
  isVisibleOnLoad = true,
  initDrawInspectOnHover = true,
  saveVisibleState = false,
  saveSearch = true,
}: InspectorProps) => {
  // Visible State
  const savedVisibleState = saveVisibleState
    ? localStorage.getItem(LS_VISIBLE_STATE)
    : null;
  const isVisibleInit =
    savedVisibleState === null ? isVisibleOnLoad : savedVisibleState === "true";
  const [isVisible, setIsVisibleHook] = useState(isVisibleInit);

  const setIsVisible = useCallback(
    (value: boolean) => {
      setIsVisibleHook(value);
      if (saveVisibleState) {
        localStorage.setItem(LS_VISIBLE_STATE, value.toString());
      }
    },
    [saveVisibleState],
  );

  // Search
  const savedSearchTerm = saveSearch
    ? localStorage.getItem(LS_SEARCH_QUERY)
    : null;
  const searchTermInit = savedSearchTerm || "";
  const { searchResults, searchQuery, searchTerm, setSearchTerm } =
    useObjectSearch(k, searchTermInit, saveSearch);

  // Update timeout and force re-render
  const [updateTimeout, setUpdateTimeout] = useState(initUpdateTimeout);
  const [renderIndex, setRenderIndex] = useState(0);

  // Draw bounding box on item hover
  const [shouldDrawInspect, setShouldDrawInspect] = useState(
    initDrawInspectOnHover,
  );
  const { setInspectObject, clearInspectObject } = useInspectOverlay(
    k,
    shouldDrawInspect,
  );

  // Set root object
  const [root, setRootHook] = useState(k.getTreeRoot());

  const setRoot = useCallback((value: GameObj) => {
    setSearchTerm("");
    setRootHook(value);
  }, []);

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

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleSearchInput = (e: Event) => {
    setSearchTerm((e.target as HTMLInputElement).value);
  };

  const contextValue = useMemo(
    () => ({
      k,
      setRoot,
      setInspectObject,
      clearInspectObject,
      shouldDrawInspect,
    }),
    [k, setRoot, setInspectObject, clearInspectObject, shouldDrawInspect],
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
        <div class="k-inspector__search">
          <input
            placeholder="Search tags or comps"
            type="text"
            class="ki-input k-inspector__search-input"
            onInput={handleSearchInput}
            value={searchTerm}
          />

          <button
            class="k-inspector__search-clear"
            onClick={() => setSearchTerm("")}
            aria-label="Clear search"
          >
            <svg viewBox="0 0 16 16" aria-hidden="true">
              <path d="M 1 1 L 15 15 M 1 15 L 15 1" />
            </svg>
          </button>
        </div>
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
        <label>
          <input
            disabled={shouldMouseInspect}
            type="checkbox"
            checked={shouldDrawInspect}
            onChange={() => setShouldDrawInspect(!shouldDrawInspect)}
          />
          Draw bbox on hover
        </label>
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
