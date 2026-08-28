import { useEffect } from "preact/hooks";
import type { GameObj } from "kaplay";
import { useApp } from "../../lib/app-context";
import { SquareMousePointer } from "lucide-preact";
import { IconToggleButton } from "../inputs/toolbar-toggle-button";
import type { KAPLAYCtxType } from "../../kaplay";
import { isFixed } from "../../lib/is-fixed";

const isHidden = (obj: GameObj): boolean => {
  return (
    Boolean(obj.hidden) ||
    Boolean(obj.parent && isHidden(obj.parent)) ||
    obj.opacity === 0
  );
};

const isDrawnAtOrAbove = (obj: GameObj, other: GameObj): boolean => {
  const layerDifference =
    (obj._drawLayerIndex ?? 0) - (other._drawLayerIndex ?? 0);

  return (
    layerDifference > 0 ||
    (layerDifference === 0 && (obj.z ?? 0) >= (other.z ?? 0))
  );
};

const isRenderAreaHovering = (obj: GameObj, k: KAPLAYCtxType) => {
  const renderArea = obj.renderArea?.();
  const hasSize =
    typeof obj.width === "number" && typeof obj.height === "number";

  if (!renderArea && !hasSize) {
    return false;
  }

  const mousePos = isFixed(obj) ? k.mousePos() : k.toWorld(k.mousePos());
  let localMousePos = obj.transform.inverse.transform(mousePos);

  const rect = renderArea instanceof k.Rect ? renderArea : null;
  const width = rect?.width ?? obj.width;
  const height = rect?.height ?? obj.height;

  if ((rect || hasSize) && obj.anchor !== "topleft") {
    const anchor = k.anchorToVec2(obj.anchor ?? "topleft");
    const offset = anchor.add(1, 1).scale(-0.5 * width, -0.5 * height);

    localMousePos = localMousePos.sub(offset);
  }

  if (renderArea) {
    return renderArea.contains(localMousePos);
  }

  return (
    localMousePos.x >= 0 &&
    localMousePos.x <= width &&
    localMousePos.y >= 0 &&
    localMousePos.y <= height
  );
};

export const MouseInspect = () => {
  const {
    k,
    setRoot,
    isMouseInspectActive,
    setMouseInspectActive,
    inspectObject,
  } = useApp();

  useEffect(() => {
    if (!isMouseInspectActive) {
      return;
    }

    const getHoveredObject = () => {
      let hoveredObject: GameObj | undefined;
      let hoveredObjectPriority = -1;

      for (const obj of k.get("*", { recursive: true })) {
        if (isHidden(obj)) {
          continue;
        }

        const hasArea = obj.has("area");
        const isHovering = hasArea
          ? obj.isHovering()
          : isRenderAreaHovering(obj, k);

        if (!isHovering) {
          continue;
        }

        const priority = hasArea ? (obj.isSensor ? 2 : 1) : 0;

        if (
          priority > hoveredObjectPriority ||
          (priority === hoveredObjectPriority &&
            hoveredObject &&
            isDrawnAtOrAbove(obj, hoveredObject))
        ) {
          hoveredObject = obj;
          hoveredObjectPriority = priority;
        }
      }

      return hoveredObject;
    };

    const drawController = k.onDraw(() => {
      inspectObject.set(getHoveredObject() ?? null);
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
      inspectObject.clear();
    };

    return cleanup;
  }, [isMouseInspectActive, inspectObject, k, setMouseInspectActive, setRoot]);

  return (
    <IconToggleButton
      checked={isMouseInspectActive}
      onChange={setMouseInspectActive}
      tooltip="Inspect an Object"
    >
      <SquareMousePointer />
    </IconToggleButton>
  );
};
