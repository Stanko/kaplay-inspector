import { useEffect } from "preact/hooks";
import { useApp } from "../lib/app-context";
import { drawBoundingBox } from "../lib/draw-bbox";

export const useInspectOverlay = () => {
  const { k, inspectObject, isDrawBBoxActive } = useApp();

  // Draw bounding box overlay after everything so it sits on top
  useEffect(() => {
    k.system(
      "kaplay-inspector-overlay",
      () => {
        const obj = inspectObject.get();

        if (!obj || !obj.exists() || obj.hidden) {
          return;
        }

        k.pushTransform();
        drawBoundingBox(obj, k);
        obj.drawInspect();
        k.popTransform();
      },
      [k.SystemPhase.AfterDraw],
    );

    return () => {
      inspectObject.clear();
    };
  }, [inspectObject, k]);

  useEffect(() => {
    if (!isDrawBBoxActive) {
      inspectObject.clear();
    }
  }, [inspectObject, isDrawBBoxActive]);
};
