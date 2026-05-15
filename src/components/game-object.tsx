import type { GameObj, KEventController } from "kaplay";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { MinusIcon, PlusIcon } from "../components/icons";
import { cx } from "../lib/cx";
import { drawBoundingBox } from "../lib/draw-bbox";
import { getObjectInfo } from "../lib/get-object-info";
import { Breadcrumbs } from "./breadcrumbs";
import { BooleanComp } from "./boolean-comp";
import { k } from "../k";

export interface GameObjectProps {
  className?: string;
  obj: GameObj;
  setRenderRoot: (obj: GameObj) => void;
  isExpanded?: boolean;
  isRenderRoot?: boolean;
  shouldDrawInspect: boolean;
}

export const GameObject = ({
  obj,
  className = "",
  isExpanded: isExpandedExternal = false,
  isRenderRoot,
  setRenderRoot,
  shouldDrawInspect,
}: GameObjectProps) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedExternal);
  const updateControllers = useRef<KEventController[]>([]);

  const { compsData, tags, compsLabel } = getObjectInfo(obj);
  const isRootObject = obj.id === 0;
  const isObjectDestroyed = !obj.exists() && !isRootObject;
  const showExpandTree = obj.children.length > 0;
  const hasChildren = obj.children.length > 0;
  const hasSize =
    typeof obj.width === "number" && typeof obj.height === "number";

  const isDrawController =
    compsData.length === 1 && compsData[0].tag === "draw";

  const isInspecting = isRenderRoot && obj.id !== 0;

  const cancelUpdateControllers = useCallback(() => {
    updateControllers.current.forEach((controller) => controller.cancel());
    updateControllers.current = [];
  }, []);

  const drawInspect = useCallback((obj: GameObj) => {
    if (!obj.hidden) {
      const updateController = k.onDraw(() => {
        k.pushTransform();
        drawBoundingBox(obj);
        obj.drawInspect();
        k.popTransform();
      });
      updateControllers.current.push(updateController);
    }
  }, []);

  useEffect(() => {
    return () => {
      cancelUpdateControllers();
    };
  }, []);

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = () => {
    cancelUpdateControllers();
    if (!isRootObject && shouldDrawInspect) {
      drawInspect(obj);
    }
  };

  // In Kaplay, onDraw and onUpdate are also game objects
  // For now, I disabled displaying draw objects,
  // mostly because inspector is adding them on hover, making the list jump around
  if (isDrawController) {
    return null;
  }

  return (
    <div
      class={cx("game-object", className, {
        "game-object--no-children": !hasChildren,
      })}
      key={obj.id}
    >
      {isInspecting && <Breadcrumbs setRenderRoot={setRenderRoot} obj={obj} />}
      <div
        class="game-object__content"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={cancelUpdateControllers}
      >
        <button
          class={cx("game-object__header", {
            "game-object__header--expandable": showExpandTree,
          })}
          onClick={handleToggleClick}
        >
          {isExpanded ? (
            <MinusIcon className="game-object__expand-icon" />
          ) : (
            <PlusIcon className="game-object__expand-icon" />
          )}
          <div class="game-object__id">ID {obj.id}:</div>
          {tags ? (
            <div class="game-object__tags">{isRootObject ? "Root" : tags}</div>
          ) : (
            <div class="game-object__comp-names">{compsLabel}</div>
          )}
          {obj.children.length > 0 && <div>({obj.children.length})</div>}

          {isObjectDestroyed && (
            <div class="game-object__destroyed">DESTROYED</div>
          )}
        </button>

        <div class="game-object__buttons">
          {!isRenderRoot && (
            <>
              <button class="ki-btn ki-btn--red" onClick={() => obj.destroy()}>
                destroy
              </button>
              <button class="ki-btn" onClick={() => setRenderRoot(obj)}>
                inspect
              </button>
            </>
          )}
          <button class="ki-btn " onClick={() => console.log(obj)}>
            log
          </button>
        </div>

        {isExpanded && (
          <div class="game-object__comps-wrapper">
            <div class="game-object__comps">
              <BooleanComp obj={obj} propName="paused" />
              <BooleanComp obj={obj} propName="hidden" />

              {hasSize && (
                <div class="game-object__comps-row">
                  <b>size</b>
                  <div>
                    {obj.width} x {obj.height}
                  </div>
                </div>
              )}

              {compsData.map((comp) => (
                <div key={comp.tag} class="game-object__comps-row">
                  <b>{comp.tag}</b>
                  <div>{comp.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div
          class="game-object__children"
          style={{ display: isExpanded ? "block" : "none" }}
        >
          {obj.children.map((child) => (
            <GameObject
              obj={child}
              key={child.id}
              setRenderRoot={setRenderRoot}
              shouldDrawInspect={shouldDrawInspect}
            />
          ))}
        </div>
      )}
    </div>
  );
};
