import pricecurve from "../../pricecurve-droids.json";

// how many remain at this price ?
export function useRemainingAtThisPricePoint(index: number) {
  if (!index || index > pricecurve.length) return { data: null };
  return { data: 123 };
}
