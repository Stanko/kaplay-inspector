import type { GameObj } from "kaplay";

export const getObjectInfo = (obj: GameObj) => {
  const tags = obj.id === 0 ? "Root" : obj.tags.slice(1).join(", ");
  const compsLabel = obj._compStates.keys().toArray().join(", ");
  const hasComponents =
    obj._compStates.size > 0 || obj._anonymousCompStates.length > 0;

  return {
    tags,
    compsLabel,
    hasComponents,
  };
};
