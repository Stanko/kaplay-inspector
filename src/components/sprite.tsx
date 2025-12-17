import type { GameObj, SpriteComp } from "kaplay";

export interface SpriteProps {
  className?: string;
  obj: GameObj;
}

export const Sprite = ({ obj }: SpriteProps) => {
  const object = obj as GameObj<SpriteComp>;
  const animation = object.getCurAnim();
  return (
    <div class="sprite">
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
