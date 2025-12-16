import type { GameObj, KAPLAYCtx, KEventController } from "kaplay";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { MinusIcon, PlusIcon } from "../components/icons";
import { cx } from "../lib/cx";
import { drawBoundingBox } from "../lib/draw-bbox";
import { getObjectInfo } from "../lib/get-object-info";
import { Breadcrumbs } from "./breadcrumbs";

export interface GameObjectProps {
  className?: string;
  obj: GameObj;
  setRenderRoot: (obj: GameObj) => void;
  isExpanded?: boolean;
  isRenderRoot?: boolean;
  k: KAPLAYCtx;
}

export const GameObject = ({
  obj,
  className = "",
  isExpanded: isExpandedExternal = false,
  isRenderRoot,
  setRenderRoot,
  k,
}: GameObjectProps) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedExternal);
  const updateControllers = useRef<KEventController[]>([]);

  const { compsData, tags, compsLabel } = getObjectInfo(obj);
  const isRootObject = obj.id === 0;
  const isObjectDestroyed = !obj.exists() && !isRootObject;
  const showExpandTree = obj.children.length > 0;
  const hasChildren = obj.children.length > 0;

  const isInspecting = isRenderRoot && obj.id !== 0;

  const cancelUpdateControllers = useCallback(() => {
    updateControllers.current.forEach((controller) => controller.cancel());
    updateControllers.current = [];
  }, []);

  const drawInspect = useCallback((obj: GameObj, isChild: boolean = false) => {
    if (!obj.hidden) {
      const updateController = obj.onDraw(() => {
        // Kaplay calls drawInspect on all of the children, no need to call it again
        if (!isChild) {
          obj.drawInspect();
        }
        drawBoundingBox(obj, k);
      });

      updateControllers.current.push(updateController);

      obj.children.forEach((child) => {
        drawInspect(child, true);
      });
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
    drawInspect(obj);
  };

  const handleMouseLeave = () => {
    cancelUpdateControllers();
  };

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
        onMouseLeave={handleMouseLeave}
      >
        <button
          class={cx("game-object__header", {
            "game-object__header--expandable": showExpandTree,
          })}
          onClick={handleToggleClick}
        >
          <span class="game-object__expand-icon">
            {isExpanded ? <MinusIcon /> : <PlusIcon />}
          </span>
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
            <button class="ki-btn" onClick={() => setRenderRoot(obj)}>
              inspect
            </button>
          )}
          <button class="ki-btn " onClick={() => console.log(obj)}>
            log
          </button>
        </div>

        {isExpanded && (
          <div class="game-object__comps-wrapper">
            <div class="game-object__comps">
              <div class="game-object__comps-row">
                <label for={`paused-${obj.id}`}>
                  <b>paused</b>
                </label>
                <div>
                  <input
                    id={`paused-${obj.id}`}
                    type="checkbox"
                    defaultChecked={obj.paused}
                    onChange={() => (obj.paused = !obj.paused)}
                  />
                </div>
              </div>

              <div class="game-object__comps-row">
                <label for={`hidden-${obj.id}`}>
                  <b>hidden</b>
                </label>
                <div>
                  <input
                    id={`hidden-${obj.id}`}
                    type="checkbox"
                    defaultChecked={obj.hidden}
                    onChange={() => (obj.hidden = !obj.hidden)}
                  />
                </div>
              </div>

              {compsData.map((comp) => (
                <div key={comp.tag} class="game-object__comps-row">
                  <div>
                    <b>{comp.tag}</b>
                  </div>
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
              k={k}
              obj={child}
              key={child.id}
              setRenderRoot={setRenderRoot}
            />
          ))}
        </div>
      )}
    </div>
  );
};
