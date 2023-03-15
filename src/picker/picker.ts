import { Color, RGBA, textContrast } from "../color/color";
import { filterColors } from "./filter";
import { Sort, sortColors } from "./sort";

export type SortPreferences = {
  type: Sort;
  invert: boolean;
}

export type FilterPreferences = {
  redness: number;
  greenness: number;
  blueness: number;
}

export type Preferences = {
  sort: SortPreferences;
  filter: FilterPreferences;
}

export class Picker {
  private colors: Color[];
  private prefs: Preferences;
  private bg: RGBA;

  constructor(colors: Color[], preferences: Partial<Preferences>) {
    this.colors = colors;
    this.prefs = mergeDefaultPreferences(preferences);
    this.bg = {r: 255, g: 255, b: 255, a: 1};
  }
  
  get drawnColors() {
    this.sortColors();
    return this.filterColors();
  }

  get textColor() {
    return textContrast(this.bg.r, this.bg.g, this.bg.b, this.bg.a);
  }

  setBackground(rgba: RGBA) {
    this.bg = rgba;
  }

  setSort(preferences: SortPreferences) {
    this.prefs.sort = {...preferences};
    this.sortColors();
  }

  setSortType(sort: Sort) {
    this.prefs.sort.type = sort;
    this.sortColors();
  }

  setSortInvert(invert: boolean) {
    this.prefs.sort.invert = invert;
    this.sortColors();
  }

  setFilter(preferences: FilterPreferences) {
    this.prefs.filter = {...preferences};
  }

  setFilterRedness(redness: number) {
    this.prefs.filter.redness = redness;
  }

  setFilterGreenness(greeness: number) {
    this.prefs.filter.greenness = greeness;
  }

  setFilterBlueness(blueness: number) {
    this.prefs.filter.blueness = blueness;
  }

  resetFilter() {
    this.prefs.filter = {...defaultPreferences.filter};
  }

  private sortColors() {
    return sortColors(this.colors, this.prefs.sort.type, this.prefs.sort.invert);
  }

  private filterColors() {
    return filterColors(this.colors, this.prefs.filter.redness, this.prefs.filter.greenness, this.prefs.filter.blueness);
  }
}

const defaultPreferences: Preferences = {
  sort: {
    type: 'hsl',
    invert: false,
  },
  filter: {
    redness: 0,
    greenness: 0,
    blueness: 0,
  }
}

function mergeDefaultPreferences(preferences?: Partial<Preferences>): Preferences {
  if (!preferences) {
    return defaultPreferences;
  }
  const p = {
    ...defaultPreferences,
    ...definedKeys(preferences)
  };
  p.sort = {
    ...defaultPreferences.sort,
    ...definedKeys(preferences.sort),
  }
  p.filter = {
    ...defaultPreferences.filter,
    ...definedKeys(preferences.filter),
  }
  return p;
}

function definedKeys(object: {[key: string]: unknown} | undefined) {
  if (object === undefined) {
    return {};
  }
  return Object.fromEntries(Object.entries(object).filter(([_, val]) => val !== undefined && val !== null));
}