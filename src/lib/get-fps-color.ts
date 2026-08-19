export const getFpsColor = (fps: number): string => {
  if (fps < 30) {
    return "red";
  }
  if (fps < 60) {
    return "orange";
  }
  return "green";
};
