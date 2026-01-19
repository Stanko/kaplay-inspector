export const toFixed = (value: number, decimalPlaces: number = 3): number => {
  return Number(value.toFixed(decimalPlaces));
};
