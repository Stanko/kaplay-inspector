import { useEffect, useRef } from "preact/hooks";
import { useApp } from "../lib/app-context";
import { drawBoundingBox } from "../lib/draw-bbox";
import type { GameObj } from "kaplay";

export const useInspectOverlay = () => {
  const { k, inspectObject, setInspectObject, isDrawBBoxActive } = useApp();
  const inspectObjectRef = useRef<GameObj | null>(null);

  useEffect(() => {
    inspectObjectRef.current = inspectObject;
  }, [inspectObject]);

  useEffect(() => {
    k.system(
      "kaplay-inspector-overlay",
      () => {
        const obj = inspectObjectRef.current;

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
      inspectObjectRef.current = null;
      setInspectObject(null);
    };
  }, [k]);

  useEffect(() => {
    if (!isDrawBBoxActive) {
      setInspectObject(null);
    }
  }, [isDrawBBoxActive]);
};
