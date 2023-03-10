import { Color, RGBA } from "./color";
import { Picker } from "./picker";
import { Sort } from "./sort";

const pickerID = 'picker';
const preferenceFormID = 'picker-preferences';
const sortFieldsetID = 'picker-preferences-sort-fieldset'
const sortSelectID = 'picker-preferences-sort-type';
const sortInvertID = 'picker-preferences-sort-invert';
const filterFieldsetID = 'picker-preferences-filter-fieldset';
const filterRednessID = 'picker-preferences-filter-redness';
const filterGreennessID = 'picker-preferences-filter-greenness';
const filterBluenessID = 'picker-preferences-filter-blueness';
const filterResetID = 'picker-preferences-filter-reset';
const setWhiteBackgroundID = 'picker-background-white';
const setBlackBackgroundID = 'picker-background-black';
const swatchTableID = 'picker-swatches';

const textCSSVar = '--picker-text';

type DrawerElements = {
  picker: HTMLElement;
  prefForm: HTMLFormElement;
  swatches: HTMLTableElement;
  sortFs: HTMLFieldSetElement;
  sortSelect: HTMLSelectElement;
  sortInvert: HTMLInputElement;
  filterFs: HTMLFieldSetElement;
  filterRed: HTMLInputElement;
  filterGreen: HTMLInputElement;
  filterBlue: HTMLInputElement;
  filterReset: HTMLButtonElement;
  bgWhite: HTMLButtonElement;
  bgBlack: HTMLButtonElement;
}

export class PickerDrawer {
  private picker: Picker;
  private elements: DrawerElements;
  constructor(picker: Picker) {
    this.picker = picker;
    this.elements = {
      picker: document.querySelector(`#${pickerID}`)!,
      prefForm: document.querySelector(`#${preferenceFormID}`)!,
      swatches: document.querySelector(`#${swatchTableID} tbody`)!,
      sortFs: document.querySelector(`#${sortFieldsetID}`)!,
      sortSelect: document.querySelector(`#${sortSelectID}`)!,
      sortInvert: document.querySelector(`#${sortInvertID}`)!,
      filterFs: document.querySelector(`#${filterFieldsetID}`)!,
      filterRed: document.querySelector(`#${filterRednessID}`)!,
      filterGreen: document.querySelector(`#${filterGreennessID}`)!,
      filterBlue: document.querySelector(`#${filterBluenessID}`)!,
      filterReset: document.querySelector(`#${filterResetID}`)!,
      bgWhite: document.querySelector(`#${setWhiteBackgroundID}`)!,
      bgBlack: document.querySelector(`#${setBlackBackgroundID}`)!,
    }
    this.elements.sortSelect.addEventListener('change', () => {
      this.picker.setSortType(this.elements.sortSelect.value as Sort);
      this.drawSwatches();
    });
    this.elements.sortInvert.addEventListener('change', () => {
      this.picker.setSortInvert(this.elements.sortInvert.checked);
      this.drawSwatches();
    });
    this.elements.filterRed.addEventListener('input', () => {
      this.picker.setFilterRedness(parseInt(this.elements.filterRed.value));
      this.drawSwatches();
    });
    this.elements.filterGreen.addEventListener('input', () => {
      this.picker.setFilterGreenness(parseInt(this.elements.filterGreen.value));
      this.drawSwatches();
    });
    this.elements.filterBlue.addEventListener('input', () => {
      this.picker.setFilterBlueness(parseInt(this.elements.filterBlue.value));
      this.drawSwatches();
    });
    this.elements.filterReset.addEventListener('click', (e) => {
      e.preventDefault();
      [this.elements.filterRed, this.elements.filterGreen, this.elements.filterBlue].map((element) => element.value = "0");
      this.picker.setFilter({redness: 0, greenness: 0, blueness: 0});
      this.drawSwatches();
    });
    this.elements.bgWhite.addEventListener('click', (e) => {
      e.preventDefault();
      this.setBackground(255, 255, 255, 1);
    });
    this.elements.bgBlack.addEventListener('click', (e) => {
      e.preventDefault();
      this.setBackground(0, 0, 0, 1);
    });
    this.picker.setSort(this.sortPreferences);
    this.picker.setFilter(this.filterPreferences);
    this.drawSwatches();
  }
  draw() {
    this.drawSwatches();
  }
  get sortPreferences() {
    return {
      type: this.elements.sortSelect.value as Sort,
      invert: this.elements.sortInvert.checked,
    }
  }
  get filterPreferences() {
    return {
      redness: parseInt(this.elements.filterRed.value),
      greenness: parseInt(this.elements.filterGreen.value),
      blueness: parseInt(this.elements.filterBlue.value),
    }
  }
  private setBackground(r, g, b, a) {
    this.picker.setBackground({r, g, b, a});
    document.documentElement.style.setProperty(textCSSVar, this.picker.textColor);
    setElementBackground(this.elements.picker, r, g, b, a);
  }
  private drawSwatches() {
    this.elements.swatches.innerHTML = '';
    for (let bar of this.swatchBars()) {
      this.elements.swatches.appendChild(bar);
    }
  }
  private swatchBars() {
    return this.picker.drawnColors.map((color) => this.swatchBar(color))
  }
  private swatchBar(color: Color) {
    const bar = document.createElement('tr');
    bar.classList.add('bar');
    for (let i = 100; i > 0; i -= 10) {
      const a = i / 100.0;
      bar.appendChild(this.swatch(color, a));
    }
    const name = document.createElement('th');
    name.scope = 'row';
    name.classList.add('bar-name')
    name.innerText = color.name;
    name.style.background = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, 0.1)`;
    bar.appendChild(name);
    return bar;
  }
  private swatch(color: Color, alpha: number) {
    const swatch = document.createElement('td')
    swatch.style.background = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${alpha})`;
    swatch.ariaLabel = `Make background ${color.name}, with alpha of ${alpha}`;
    swatch.style.width = '5vw';
    swatch.style.height = '5vw';
    swatch.style.aspectRatio = '1';
    swatch.style.border = '0 none';
    swatch.addEventListener('click', () => {
      this.setBackground(color.rgb.r, color.rgb.g, color.rgb.b, alpha);
    });
    return swatch;
  }
}

function setElementBackground(element: HTMLElement, r: number, g: number, b: number, a: number) {
  element.style.background = `rgba(${r}, ${g}, ${b}, ${a})`;
}