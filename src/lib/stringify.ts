export const stringify = (obj: any, maxDepth = 1, currentDepth = 0): string => {
  if (typeof obj !== "object" || obj === null) {
    return JSON.stringify(obj);
  }

  const lines = Object.entries(obj).map(([key, value]) => {
    if (typeof value === "function") {
      return `${key}: function`;
    } else if (typeof value === "object") {
      if (currentDepth < maxDepth) {
        return `${key}: ${stringify(value, maxDepth, currentDepth + 1)}`;
      } else {
        return `${key}: [Object object]`;
      }
    } else {
      return `${key}: ${value}`;
    }
  });

  return `{ ${lines.join(", ")} }`;
};
