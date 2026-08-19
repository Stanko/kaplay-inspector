import type { GameObj } from "kaplay";
import { useInspector } from "./inspector-context";
import { getObjectInfo } from "../lib/get-object-info";

export interface ChildObjectProps {
  obj: GameObj;
}

export const ChildObject = ({ obj }: ChildObjectProps) => {
  const { setRoot } = useInspector();
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
