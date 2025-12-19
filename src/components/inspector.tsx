import { useEffect, useRef, useState } from "preact/hooks";
import type { InspectorOptions, KAPLAYCtxType } from "../init";
import { GameObject } from "./game-object";
import { useObjectBoolean } from "./boolean-comp";
import type { GameObj } from "kaplay";
import { SearchResults } from "./search-results";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<GameObj[]>([]);
  const typingTimeout = useRef<ReturnType<typeof setTimeout>>();

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

  const search = (term: string) => {
    setSearchResults(k.get(term, { recursive: true, liveUpdate: true }));
  };

  const handleSearchInput = (e: Event) => {
    const term = (e.target as HTMLInputElement).value;
    setSearchTerm(term);
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      search(term);
    }, TYPING_TIMEOUT);
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
        <button class="ki-btn" onClick={() => paused.onChange(!paused.checked)}>
          {paused.checked ? "Resume Game" : "Pause Game"}
        </button>
        &bull;
        <input
          placeholder="Search tags or comps"
          type="text"
          class="ki-input"
          onInput={handleSearchInput}
        />
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
        {searchTerm.length > 0 ? (
          <SearchResults
            k={k}
            results={searchResults}
            setRenderRoot={setRoot}
            shouldDrawInspect={shouldDrawInspect}
          />
        ) : (
          <GameObject
            k={k}
            className="game-object--root"
            obj={root}
            setRenderRoot={setRoot}
            shouldDrawInspect={shouldDrawInspect}
            isExpanded
            isRenderRoot
          />
        )}
      </div>
    </>
  );
};
