import type { GameObj } from "kaplay";

export const isFixed = (obj: GameObj): boolean => {
  return Boolean(obj.fixed) || Boolean(obj.parent && isFixed(obj.parent));
};
