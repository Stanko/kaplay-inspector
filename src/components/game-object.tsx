import type { GameObj, KAPLAYCtx, KEventController } from "kaplay";
import { useEffect, useRef, useState } from "preact/hooks";
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
  const mouseHoverController = useRef<KEventController>(null);

  const { compsData, tags, compsLabel } = getObjectInfo(obj);
  const isRootObject = obj.id === 0;
  const isObjectDestroyed = !obj.exists() && !isRootObject;
  const showExpandTree = obj.children.length > 0;
  const hasChildren = obj.children.length > 0;

  const isInspecting = isRenderRoot && obj.id !== 0;

  useEffect(() => {
    return () => {
      mouseHoverController.current?.cancel();
    };
  }, []);

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = () => {
    mouseHoverController.current?.cancel();

    if (!obj.hidden) {
      mouseHoverController.current = obj.onDraw(() => {
        obj.drawInspect();
        drawBoundingBox(obj, k);
      });
    }
  };

  const handleMouseLeave = () => {
    mouseHoverController.current?.cancel();
  };

  return (
    <div
      class={cx("obj", className, {
        "obj--no-children": !hasChildren,
      })}
      key={obj.id}
    >
      {isInspecting && <Breadcrumbs setRenderRoot={setRenderRoot} obj={obj} />}
      <div
        class="obj__content"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          class={cx("obj__header", {
            "obj__header--expandable": showExpandTree,
          })}
          onClick={handleToggleClick}
        >
          <span class="obj__expand-icon">
            {isExpanded ? <MinusIcon /> : <PlusIcon />}
          </span>
          <div class="obj__id">ID {obj.id}:</div>
          {tags ? (
            <div class="obj__tags">{isRootObject ? "Root" : tags}</div>
          ) : (
            <div class="obj__comp-names">{compsLabel}</div>
          )}
          {obj.children.length > 0 && <div>({obj.children.length})</div>}

          {isObjectDestroyed && <div class="obj__destroyed">DESTROYED</div>}
        </button>

        <div class="obj__buttons">
          {!isRenderRoot && (
            <button class="btn" onClick={() => setRenderRoot(obj)}>
              inspect
            </button>
          )}
          <button class="btn " onClick={() => console.log(obj)}>
            log
          </button>
        </div>

        {isExpanded && (
          <div class="obj__comps-wrapper">
            <div class="obj__comps">
              <div class="obj__comps-row">
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

              {compsData.map((comp) => (
                <div key={comp.tag} class="obj__comps-row">
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
          class="obj__children"
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
