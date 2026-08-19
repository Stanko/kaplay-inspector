import type { GameObj } from "kaplay";
import { useCallback, useEffect, useRef } from "preact/hooks";
import type { KAPLAYCtxType } from "../kaplay";
import { drawBoundingBox } from "../lib/draw-bbox";

export const useInspectOverlay = (k: KAPLAYCtxType, isEnabled: boolean) => {
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
    if (!isEnabled) {
      inspectObject.current = null;
    }
  }, [isEnabled]);

  return { setInspectObject, clearInspectObject };
};
