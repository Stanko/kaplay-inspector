import type { GameObj } from "kaplay";
import { useCallback, useEffect, useState } from "preact/hooks";
import { MinusIcon, PlusIcon } from "../components/icons";
import { cx } from "../lib/cx";
import { getObjectInfo } from "../lib/get-object-info";
import { Breadcrumbs } from "./breadcrumbs";
import { BooleanComp } from "./boolean-comp";
import { useApp } from "../lib/app-context";

export interface GameObjectProps {
  className?: string;
  obj: GameObj;
  isExpanded?: boolean;
  isRenderRoot?: boolean;
}

export const GameObject = ({
  obj,
  className = "",
  isExpanded: isExpandedExternal = false,
  isRenderRoot,
}: GameObjectProps) => {
  const { setRoot, isDrawBBoxActive, setInspectObject, clearInspectObject } =
    useApp();
  const [isExpanded, setIsExpanded] = useState(isExpandedExternal);

  const { compsData, tags, compsLabel } = getObjectInfo(obj);
  const isRootObject = obj.id === 0;
  const isObjectDestroyed = !obj.exists() && !isRootObject;
  const showExpandTree = obj.children.length > 0;
  const hasChildren = obj.children.length > 0;
  const hasSize =
    typeof obj.width === "number" && typeof obj.height === "number";

  const isInspecting = isRenderRoot && obj.id !== 0;

  const cleanup = useCallback(() => {
    clearInspectObject(obj);
  }, [clearInspectObject, obj]);

  useEffect(() => cleanup, [cleanup]);

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = () => {
    if (!isRootObject && isDrawBBoxActive && !obj.hidden) {
      setInspectObject(obj);
    }
  };

  // Skip drawing if there are no components to inspect
  if (compsData.length === 0) {
    return null;
  }

  return (
    <div
      class={cx("game-object", className, {
        "game-object--no-children": !hasChildren,
      })}
      key={obj.id}
    >
      {isInspecting && <Breadcrumbs obj={obj} />}
      <div
        class="game-object__content"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={cleanup}
      >
        <div class="game-object__sticky-header">
          <button
            class={cx("game-object__header", {
              "game-object__header--expandable": showExpandTree,
              "game-object__header--expanded": isExpanded,
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
              <div class="game-object__tags">
                {isRootObject ? "Root" : tags}
              </div>
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
                <button
                  class="ki-btn ki-btn--red"
                  onClick={() => obj.destroy()}
                >
                  destroy
                </button>
                <button class="ki-btn" onClick={() => setRoot(obj)}>
                  inspect
                </button>
              </>
            )}
            <button class="ki-btn " onClick={() => console.log(obj)}>
              log
            </button>
          </div>
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
                <div key={comp.label} class="game-object__comps-row">
                  <b>{comp.label}</b>
                  <div>{comp.control}</div>
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
            <GameObject obj={child} key={child.id} />
          ))}
        </div>
      )}
    </div>
  );
};
