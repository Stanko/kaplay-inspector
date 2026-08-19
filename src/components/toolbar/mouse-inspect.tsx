import { useEffect } from "preact/hooks";
import { useApp } from "../../lib/app-context";
import { SquareMousePointer } from "lucide-preact";
import { ToolbarButtonToggle } from "../inputs/toolbar-toggle-button";

export const MouseInspect = () => {
  const {
    k,
    setRoot,
    isMouseInspectActive,
    setMouseInspectActive,
    setInspectObject,
  } = useApp();

  useEffect(() => {
    if (!isMouseInspectActive) {
      return;
    }

    const getHoveredObject = () =>
      k
        .get("*", { recursive: true })
        .find((obj) => obj.has("area") && obj.isHovering());

    const drawController = k.onDraw(() => {
      setInspectObject(getHoveredObject() ?? null);
    });

    const clickController = k.onMousePress("left", () => {
      const obj = getHoveredObject();

      if (obj) {
        setRoot(obj);
        setMouseInspectActive(false);
      }
    });

    const sceneChangeController = k.onSceneLeave(() => {
      setMouseInspectActive(false);
      cleanup();
    });

    const cleanup = () => {
      sceneChangeController.cancel();
      drawController.cancel();
      clickController.cancel();
      setInspectObject(null);
    };

    return cleanup;
  }, [
    isMouseInspectActive,
    k,
    setInspectObject,
    setMouseInspectActive,
    setRoot,
  ]);

  return (
    <ToolbarButtonToggle
      checked={isMouseInspectActive}
      onChange={() => setMouseInspectActive(!isMouseInspectActive)}
      tooltip="Inspect an Object"
    >
      <SquareMousePointer />
    </ToolbarButtonToggle>
  );
};
