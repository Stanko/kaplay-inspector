import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";
import type { InspectorOptions } from "../init";
import { GameObject } from "./game-object";
import { useObjectBoolean } from "./boolean-comp";
import type { GameObj } from "kaplay";
import { SearchResults } from "./search-results";
import { Recorder } from "./recorder";
import { getFpsColor } from "../lib/get-fps-color";
import { InspectorContext } from "./inspector-context";
import type { KAPLAYCtxType } from "../kaplay";

export interface InspectorProps extends InspectorOptions {
  k: KAPLAYCtxType;
}

const INTERVAL_OPTIONS = [
  { value: 100, label: "100ms" },
  { value: 250, label: "250ms" },
  { value: 500, label: "500ms" },
  { value: 1000, label: "1s" },
];

const TYPING_TIMEOUT = 250;

const LS_VISIBLE_STATE = "ki__is-visible";
const LS_SEARCH_TERM = "ki__search-term";

export const Inspector = ({
  k,
  initUpdateTimeout = 250,
  isVisibleOnLoad = true,
  initDrawInspectOnHover = true,
  saveVisibleState = false,
  saveSearch = true,
}: InspectorProps) => {
  const savedVisibleState = saveVisibleState
    ? localStorage.getItem(LS_VISIBLE_STATE)
    : null;
  const isVisibleInit =
    savedVisibleState === null ? isVisibleOnLoad : savedVisibleState === "true";

  const savedSearchTerm = saveSearch
    ? localStorage.getItem(LS_SEARCH_TERM)
    : null;
  const searchTermInit = savedSearchTerm || "";
  const [updateTimeout, setUpdateTimeout] = useState(initUpdateTimeout);
  const [shouldDrawInspect, setShouldDrawInspect] = useState(
    initDrawInspectOnHover,
  );
  const [root, setRootHook] = useState(k.getTreeRoot());
  const [renderIndex, setRenderIndex] = useState(0);
  const [isVisible, setIsVisibleHook] = useState(isVisibleInit);
  const [searchTerm, setSearchTermHook] = useState(searchTermInit);
  const [searchResults, setSearchResults] = useState<GameObj[]>([]);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();
  const searchQuery = searchTerm.trim();

  const setRoot = useCallback((value: GameObj) => {
    setSearchTerm("");
    setRootHook(value);
  }, []);

  const setIsVisible = useCallback(
    (value: boolean) => {
      setIsVisibleHook(value);
      if (saveVisibleState) {
        localStorage.setItem(LS_VISIBLE_STATE, value.toString());
      }
    },
    [saveVisibleState],
  );

  const setSearchTerm = useCallback(
    (value: string) => {
      setSearchTermHook(value);
      if (saveSearch) {
        localStorage.setItem(LS_SEARCH_TERM, value);
      }
    },
    [saveSearch],
  );

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

  useEffect(() => {
    clearTimeout(typingTimeout.current);

    if (searchQuery === "") {
      setSearchResults([]);
      return;
    }

    typingTimeout.current = setTimeout(() => {
      setSearchResults(
        k.get(searchQuery, { recursive: true, liveUpdate: true }),
      );
    }, TYPING_TIMEOUT);
  }, [k, searchQuery]);

  const handleSearchInput = (e: Event) => {
    setSearchTerm((e.target as HTMLInputElement).value);
  };

  const contextValue = useMemo(
    () => ({ k, setRoot, shouldDrawInspect }),
    [k, setRoot, shouldDrawInspect],
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
        <input
          placeholder="Search tags or comps"
          type="text"
          class="ki-input"
          onInput={handleSearchInput}
          value={searchTerm}
        />
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
            type="checkbox"
            checked={shouldDrawInspect}
            onChange={() => setShouldDrawInspect(!shouldDrawInspect)}
          />
          Draw bbox on hover
        </label>
        <div class="ki-separator" />
        <Recorder />
        <button class="ki-btn k-inspector__hide" onClick={toggleVisibility}>
          Hide
        </button>
      </div>

      <div class="k-inspector__objects">
        {searchQuery.length > 0 ? (
          <SearchResults
            results={searchResults}
          />
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
