import pricecurve from "../../pricecurve-droids.json";

// how many remain at this price ?
export function useRemainingAtThisPricePoint(index: number) {
  console.log("index=",index)
  if (!index || index > pricecurve.length) return { data: null };
  let iterator = index;
  while (iterator <= pricecurve.length && pricecurve[iterator] === pricecurve[index]) {
    iterator++;
  }
  console.log("iterator=",iterator)
  return { data: iterator - index + 1 };
}
