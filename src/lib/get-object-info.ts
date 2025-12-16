import type { GameObj } from "kaplay";
import { inspectComps } from "./inspect-comps";

export const getObjectInfo = (obj: GameObj) => {
  const compsData = inspectComps(obj);
  const tags = obj.id === 0 ? "Root" : obj.tags.slice(1).join(", ");
  const compsLabel = compsData.map((comp) => comp.tag).join(", ");

  return {
    compsData,
    tags,
    compsLabel,
  };
};
