import type { GameObj, SpriteComp } from "kaplay";

export interface SpriteControlProps {
  className?: string;
  obj: GameObj;
}

export const SpriteControl = ({ obj }: SpriteControlProps) => {
  const object = obj as GameObj<SpriteComp>;
  const animation = object.getCurAnim();
  return (
    <div class="sprite-control">
      <b>{object.sprite}</b>
      <div>frame: {object.frame}</div>
      {animation && (
        <>
          <div>animation: {animation.name}</div>
          <div>animation frame: {animation?.frameIndex}</div>
        </>
      )}
    </div>
  );
};
