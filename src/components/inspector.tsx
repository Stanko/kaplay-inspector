import { useEffect, useState } from "preact/hooks";
import { GameObject } from "./game-object";
import { SearchResults } from "./search-results";
import { Recorder } from "./toolbar/recorder";
import { getFpsColor } from "../lib/get-fps-color";
import { Textures } from "./toolbar/textures";
import { useApp } from "../lib/app-context";
import { DrawBBox } from "./toolbar/draw-bb-box";
import { Search } from "./toolbar/search";
import { UpdateInterval } from "./toolbar/update-interval";
import { MouseInspect } from "./toolbar/mouse-inspect";
import { useInspectOverlay } from "../hooks/use-inspect-overlay";
import { PauseGame } from "./toolbar/pause-game";
import { Gamepad2, Minimize2 } from "lucide-preact";
import { IconButton } from "./inputs/toolbar-button";

export const Inspector = () => {
  const { k, root, isVisible, toggleVisibility, searchQuery, updateInterval } =
    useApp();

  const [, setRenderIndex] = useState(0);

  useInspectOverlay();

  // Force re-render every updateInterval milliseconds
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isVisible) {
      interval = setInterval(() => {
        setRenderIndex((index) => index + 1);
      }, updateInterval);
    }

    return () => clearInterval(interval);
  }, [updateInterval, isVisible]);

  if (!isVisible) {
    return (
      <IconButton
        className="ki-show-inspector"
        onClick={toggleVisibility}
        tooltip="Show Kaplay Inspector"
      >
        <Gamepad2 />
      </IconButton>
    );
  }

  const fps = Math.round(k.debug.fps());
  const fpsColor = getFpsColor(fps);

  const objectCount = k.debug.numObjects();

  // Unfortunately, liveUpdate queries are only destroyed on scene change,
  // so they can accumulate and cause memory leaks
  // Therefore I use regular get instead while polling
  const searchResults =
    searchQuery.length > 0 ? k.get(searchQuery, { recursive: true }) : [];

  return (
    <>
      <div class="ki-header">
        <PauseGame />
        <MouseInspect />
        <DrawBBox />
        <UpdateInterval />
        <Textures />
        <Recorder />

        <Search />
        <div>
          {objectCount} object{objectCount !== 1 && "s"}
        </div>
        <div class={fpsColor}>{fps} fps</div>

        <IconButton
          className="ki-hide-inspector"
          onClick={toggleVisibility}
          tooltip="Hide Inspector"
        >
          <Minimize2 />
        </IconButton>
      </div>

      <div class="ki-objects">
        {searchQuery.length > 0 ? (
          <SearchResults results={searchResults} />
        ) : (
          <GameObject
            className="ki-obj--root"
            obj={root}
            isExpanded
            isRenderRoot
          />
        )}
      </div>
    </>
  );
};
