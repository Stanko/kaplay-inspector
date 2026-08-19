export const toFixed = (value: number, decimalPlaces: number = 3): number => {
  if (isNaN(value)) {
    return 0;
  }
  if (!isFinite(value)) {
    return Math.sign(value) * Number.MAX_SAFE_INTEGER;
  }

  return Number(value.toFixed(decimalPlaces));
};
