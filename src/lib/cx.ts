export const cx = (...classes: (string | Record<string, any>)[]) => {
  return classes
    .map((cls) => {
      if (typeof cls === "string") {
        return cls;
      }
      return Object.keys(cls)
        .filter((key) => cls[key])
        .join(" ");
    })
    .join(" ");
};
