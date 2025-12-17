import type { GameObj, SpriteComp } from "kaplay";

export interface SpriteControlsProps {
  className?: string;
  obj: GameObj;
}

export const SpriteControls = ({ obj }: SpriteControlsProps) => {
  const object = obj as GameObj<SpriteComp>;
  const animation = object.getCurAnim();
  return (
    <div class="sprite-controls">
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
