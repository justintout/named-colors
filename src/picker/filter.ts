import { Color } from "./color";

export function filterColors(colors: Color[], redness: number, greenness: number, blueness: number): Color[] {
  return colors
    .filter((color) => filter(color.rgb.r, redness))
    .filter((color) => filter(color.rgb.g, greenness))
    .filter((color) => filter(color.rgb.b, blueness));
}

function filter(color: number, value: number): boolean {
  let min = 0;
  let max = 255;
  if (value === 0) return true;
  if (value < 0) {
    max += value;
  }
  if (value > 0) {
    min += value;
  }
  console.log(min, max);
  return min <= color && color <= max;
}