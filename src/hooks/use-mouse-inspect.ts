import { useEffect, useState } from "preact/hooks";
import type { KAPLAYCtxType } from "../kaplay";
import type { GameObj } from "kaplay";

export const useMouseInspect = (
  k: KAPLAYCtxType,
  setInspectObject: (obj: GameObj | null) => void,
  setRoot: (obj: GameObj) => void,
) => {
  const [shouldMouseInspect, setShouldMouseInspect] = useState(false);

  useEffect(() => {
    if (!shouldMouseInspect) {
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
        setShouldMouseInspect(false);
      }
    });

    const sceneChangeController = k.onSceneLeave(() => {
      setShouldMouseInspect(false);
      cleanup();
    });

    const cleanup = () => {
      sceneChangeController.cancel();
      drawController.cancel();
      clickController.cancel();
      setInspectObject(null);
    };

    return cleanup;
  }, [k, setInspectObject, setRoot, shouldMouseInspect]);

  return { shouldMouseInspect, setShouldMouseInspect };
};
