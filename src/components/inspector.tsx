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
import { ToolbarButton } from "./inputs/toolbar-button";

export const Inspector = () => {
  const {
    k,
    root,
    isVisible,
    toggleVisibility,
    searchResults,
    searchQuery,
    updateInterval,
  } = useApp();

  const [, setRenderIndex] = useState(0);

  useInspectOverlay();

  // Force re-render every updateInterval milliseconds
  useEffect(() => {
    const interval = setInterval(() => {
      setRenderIndex((index) => index + 1);
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  if (!isVisible) {
    return (
      <ToolbarButton
        className="k-inspector__show"
        onClick={toggleVisibility}
        tooltip="Show Kaplay Inspector"
      >
        <Gamepad2 />
      </ToolbarButton>
    );
  }

  const fps = Math.round(k.debug.fps());
  const fpsColor = getFpsColor(fps);

  return (
    <>
      <div class="k-inspector__header">
        <PauseGame />
        <DrawBBox />
        <MouseInspect />
        <Recorder />
        <Textures />
        <UpdateInterval />
        <Search />
        <div>{k.get("*", { recursive: true }).length} objects</div>
        <div class={fpsColor}>{fps} fps</div>

        <ToolbarButton
          className="k-inspector__hide"
          onClick={toggleVisibility}
          tooltip="Hide Inspector"
        >
          <Minimize2 />
        </ToolbarButton>
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
    </>
  );
};
