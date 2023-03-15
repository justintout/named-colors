import { AlphaColor } from "../color/color";


export class Palette {
  private _colors: Set<AlphaColor> = new Set();
  constructor(colors?: AlphaColor[]) {
    if (colors) {
      this._colors = new Set(colors);
    }
  }

  get colors(): AlphaColor[] {
    return [...this._colors];
  }

  add(color: AlphaColor) {
    this._colors.add(color);
  }

  remove(name: string) {
    const c = this.colors;
    const i = c.findIndex((c) => c.name === name);
    if (i > -1) {
      c.splice(i, 1);
      this._colors = new Set(c);
    }
  }

  clear() {
    this._colors.clear();
  }

  scramble() {
    const c = this.colors.sort((a, b) => Math.random() >= 0.5 ? 1 : -1);
    this._colors = new Set(c);
  }

}