import { isGameObj } from "./is-game-obj";

export const stringify = (obj: any, maxDepth = 1, currentDepth = 0): string => {
  if (typeof obj !== "object") {
    return JSON.stringify(obj);
  }

  const lines = Object.entries(obj).map(([key, value]) => {
    if (value === null) {
      return `${key}: null`;
    } else if (typeof value === "function") {
      return `${key}: function`;
    } else if (typeof value === "object") {
      if (isGameObj(value)) {
        return `${key}: [GameObj]`;
      }

      if (currentDepth < maxDepth) {
        return `${key}: ${stringify(value, maxDepth, currentDepth + 1)}`;
      } else {
        return `${key}: [Object]`;
      }
    } else {
      return `${key}: ${value}`;
    }
  });

  return `{ ${lines.join(", ")} }`;
};
