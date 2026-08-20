import type { GameObj } from "kaplay";
import { inspectComps } from "./inspect-comps";

export const getObjectInfo = (obj: GameObj) => {
  const compsData = inspectComps(obj);

  return {
    compsData,
    ...getObjectDisplayName(obj),
  };
};

export const getObjectDisplayName = (obj: GameObj) => {
  const tags = obj.id === 0 ? "Root" : obj.tags.slice(1).join(", ");

  const compsLabel = obj._compStates.keys().toArray().join(", ");

  return {
    tags,
    compsLabel,
  };
};
