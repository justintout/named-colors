import { Color } from "./color";

export type Sort = 'hsl' | 'name';
type ColorSort = (a: Color, b: Color) => number;

export const defaultSort = hslSort(false);

export function textContrast(r,g,b,a) {
  const brightness = r * 0.299 + g * 0.587 + b * 0.114 + (1-a) * 255;
  return brightness > 186 ? 'black' : 'white';
}

export function sortColors(colors: Color[], sort: Sort = 'hsl', invert = false) {  
  return colors.sort(getSort(sort, invert));
}

function hslSort(invert: boolean): ColorSort {
  const i = invert ? -1 : 1;
  return (a, b) => a.hsl.h > b.hsl.h 
    ? -1 * i
    : a.hsl.h < b.hsl.h 
      ? 1 * i
      : a.hsl.s > b.hsl.s 
        ? -1 * i
        : a.hsl.s < b.hsl.s
          ? 1 * i
          : a.hsl.l > b.hsl.l 
            ? -1 * i
            : a.hsl.l < b.hsl.l 
              ? 1 * i
              : 0;
}

function nameSort(invert: boolean): ColorSort {
  const i = invert ? -1 : 1;
  return (a, b) => a.name > b.name 
    ? 1 * i
    : a.name < b.name
      ? -1 * i
      : 0;
}

function getSort(sort: Sort, invert: boolean): ColorSort {
  switch (sort) {
    case "hsl":
      return hslSort(invert);
    case 'name':
      return nameSort(invert);
    default:
      return defaultSort;
  }
}


