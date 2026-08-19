import type { GameObj } from "kaplay";
import { useCallback, useEffect, useRef } from "preact/hooks";
import { drawBoundingBox } from "../lib/draw-bbox";
import type { KAPLAYCtxType } from "../kaplay";

export const useInspectOverlay = (
  k: KAPLAYCtxType,
  shouldDrawInspect: boolean,
) => {
  const inspectObject = useRef<GameObj | null>(null);

  const setInspectObject = useCallback((obj: GameObj | null) => {
    inspectObject.current = obj;
  }, []);

  const clearInspectObject = useCallback((obj: GameObj) => {
    if (inspectObject.current === obj) {
      inspectObject.current = null;
    }
  }, []);

  useEffect(() => {
    k.system(
      "kaplay-inspector-overlay",
      () => {
        const obj = inspectObject.current;

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
      inspectObject.current = null;
    };
  }, [k]);

  useEffect(() => {
    if (!shouldDrawInspect) {
      inspectObject.current = null;
    }
  }, [shouldDrawInspect]);

  return { setInspectObject, clearInspectObject };
};
