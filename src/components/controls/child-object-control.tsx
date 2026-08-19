import type { GameObj } from "kaplay";
import { getObjectInfo } from "../../lib/get-object-info";
import { useApp } from "../../lib/app-context";

export interface ChildObjectProps {
  obj: GameObj;
}

export const ChildObjectControl = ({ obj }: ChildObjectProps) => {
  const { setRoot } = useApp();
  const { tags, compsLabel } = getObjectInfo(obj);
  const isRootObject = obj.id === 0;
  const isObjectDestroyed = !obj.exists() && !isRootObject;

  return (
    <div class="child-object">
      <b>Child Object</b>
      {isObjectDestroyed ? (
        <div class="game-object__destroyed">DESTROYED</div>
      ) : (
        <div class="game-object__id">ID {obj.id}:</div>
      )}
      {tags ? (
        <div class="game-object__tags">{tags}</div>
      ) : (
        <div class="game-object__comp-names">{compsLabel}</div>
      )}
      {obj.children.length > 0 && <div>({obj.children.length})</div>}
      <div class="game-object__buttons">
        {!isRootObject && (
          <>
            <button class="ki-btn ki-btn--red" onClick={() => obj.destroy()}>
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
  );
};
