import type { GameObj } from "kaplay";
import { useCallback, useEffect, useState } from "preact/hooks";
import { cx } from "../lib/cx";
import { getObjectInfo } from "../lib/get-object-info";
import { Breadcrumbs } from "./breadcrumbs";
import { BooleanComp } from "./controls/boolean-control";
import { useApp } from "../lib/app-context";
import { MinusSquare, PlusSquare } from "lucide-preact";
import { inspectComps } from "../lib/inspect-comps";

export interface GameObjectProps {
  className?: string;
  obj: GameObj;
  isExpanded?: boolean;
  isRenderRoot?: boolean;
}

const GameObjectDetails = ({ obj }: { obj: GameObj }) => {
  const compsData = inspectComps(obj);
  const hasSize =
    typeof obj.width === "number" && typeof obj.height === "number";

  return (
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
  );
};

export const GameObject = ({
  obj,
  className = "",
  isExpanded: isExpandedExternal = false,
  isRenderRoot,
}: GameObjectProps) => {
  const { setRoot, isDrawBBoxActive, inspectObject } = useApp();
  const [isExpanded, setIsExpanded] = useState(isExpandedExternal);

  const { tags, compsLabel, hasComponents } = getObjectInfo(obj);
  const isRootObject = obj.id === 0;
  const isObjectDestroyed = !obj.exists() && !isRootObject;
  const showExpandTree = obj.children.length > 0;
  const hasChildren = obj.children.length > 0;
  const isInspecting = isRenderRoot && obj.id !== 0;

  const cleanup = useCallback(() => {
    inspectObject.clear(obj);
  }, [inspectObject, obj]);

  useEffect(() => cleanup, [cleanup]);

  const handleToggleClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = () => {
    if (!isRootObject && isDrawBBoxActive && !obj.hidden) {
      inspectObject.set(obj);
    }
  };

  // Skip drawing if there are no components or children to inspect
  if (!hasComponents && obj.children.length === 0) {
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
              <MinusSquare className="game-object__expand-icon" />
            ) : (
              <PlusSquare className="game-object__expand-icon" />
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

        {isExpanded && <GameObjectDetails obj={obj} />}
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
