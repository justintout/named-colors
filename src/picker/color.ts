import * as cc from 'color-convert';

export type RGB = { r: number, g: number, b: number };
export interface RGBA extends RGB { a: number };
export type HSL = { h: number, s: number, l: number };

export type Color = {
  name: string,
  hex: string,
  rgb: RGB,
  hsl: HSL,
}

const aliases = {
  'aqua': ['cyan'],
  'fuschsia': ['magenta'],
  'darkgray':  ['darkgrey'],
  'darkslategray':  ['darkslategrey'],
  'dimgray':  ['dimgrey'],
  'lightgray':  ['lightgrey'],
  'lightslategray':  ['lightslategrey'],
  'gray':  ['grey'],
  'slategray':  ['slategrey'],
}

function isAlias(name: string): boolean {
  return Object.values(aliases).flat(2).includes(name);
}

function hasAlias(name: string): boolean {
  return Object.keys(aliases).includes(name);
}

export async function getColors(): Promise<Color[]> {
  const response = await fetch("https://w3c.github.io/csswg-drafts/css-color/", {headers: {'Accept': 'text/html'}})
  const body = await response.text();
  const e = document.createElement('html');
  e.innerHTML = body;
  return [...e.querySelectorAll('table.named-color-table > tbody > tr')]
    .map((row) => {
        let name = row.querySelector('th')?.innerText.trim().replace('\n', '')!;
        if (hasAlias(name)) {
          name += `/${aliases[name].join('/')}`;
        }
        const vals = [...row.querySelectorAll<HTMLElement>('td:not([style])')].map((td) => td.innerText.trim().replace('\n',''))
        const rgb = Object.fromEntries(vals[1].split(' ').map((v, i) => [i === 0 ? 'r' : i === 1 ? 'g' : 'b', parseInt(v)])) as RGB;
        const hsl = Object.fromEntries(cc.rgb.hsl(rgb.r, rgb.g, rgb.b).map((v, i) => [i === 0 ? 'h': i === 1 ? 's' : 'l', v])) as HSL;
        return {
          name,
          hex: vals[0],
          rgb,
          hsl
        }
    })
    .filter((color) => !isAlias(color.name));
}

export function textContrast(r,g,b,a) {
  const brightness = r * 0.299 + g * 0.587 + b * 0.114 + (1-a) * 255;
  return brightness > 186 ? 'black' : 'white';
}