import type { GameObj } from "kaplay";

export interface ChildObjectProps {
  className?: string;
  obj: GameObj;
}

export const ChildObject = ({ className = "", obj }: ChildObjectProps) => {
  return (
    <div class={className}>
      game object{" "}
      <button class="ki-btn" onClick={() => console.log(obj)}>
        log
      </button>
    </div>
  );
};
