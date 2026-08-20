import type { GameObj } from "kaplay";
import { getObjectInfo } from "../../lib/get-object-info";
import { useApp } from "../../lib/app-context";

export interface ChildRefProps {
  obj: GameObj;
}

export const ChildRefControl = ({ obj }: ChildRefProps) => {
  const { setRoot } = useApp();
  const { tags, compsLabel } = getObjectInfo(obj);
  const isRootObject = obj.id === 0;
  const isObjectDestroyed = !obj.exists() && !isRootObject;

  return (
    <div class="ki-object-ref ki-relative ki-flex">
      <b>Child Ref</b>
      {isObjectDestroyed ? (
        <div class="ki-obj__destroyed">DESTROYED</div>
      ) : (
        <div class="ki-obj__id">ID {obj.id}:</div>
      )}
      {tags ? (
        <div class="ki-obj__tags">{tags}</div>
      ) : (
        <div class="ki-obj__comp-names">{compsLabel}</div>
      )}
      {obj.children.length > 0 && <div>({obj.children.length})</div>}
      <div class="ki-obj__buttons">
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
