import { AlphaColor, alphaColorCSS } from "../color/color";
import { Palette } from "./palette";

const paletteID = 'palette';
const swatchesID = 'palette-swatches';
const scrambleButtonID = 'palette-scramble';
const clearButtonID = 'palette-clear';

type PaletteElements = {
  palette: HTMLDivElement;
  swatches: HTMLUListElement;
  scramble: HTMLButtonElement;
  clear: HTMLButtonElement;
}

export class PaletteDrawer {
  private elements: PaletteElements;
  private palette: Palette;
  constructor() {
    this.palette = new Palette();
    this.elements = {
      palette: document.querySelector(`#${paletteID}`)!,
      swatches: document.querySelector(`#${swatchesID}`)!,
      scramble: document.querySelector(`#${scrambleButtonID}`)!,
      clear: document.querySelector(`#${clearButtonID}`)!,
    }
    this.elements.scramble.addEventListener('click', (e) => {
      e.preventDefault();
      this.palette.scramble();
      this.drawPalette();
    });
    this.elements.clear.addEventListener('click', (e) => {
      e.preventDefault();
      this.palette.clear();
      this.drawPalette();
    });
    this.drawPalette();
  }

  private drawPalette() {
    this.elements.swatches.innerHTML = '';
    this.palette.colors.map(this.swatch).forEach((div) => this.elements.swatches.appendChild(div));
  }

  private swatch(color: AlphaColor) {
    const div = document.createElement('div');
    div.classList.add('palette-swatch');
    div.style.background = alphaColorCSS(color);
    return div;
  }

  add(color: AlphaColor) {
    this.palette.add(color);
    this.drawPalette();
  }
} 