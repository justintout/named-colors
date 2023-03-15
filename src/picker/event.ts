import { AlphaColor, Color } from "../color/color"

export interface EventMap {
  'swatch-picked': CustomEvent<SwatchPickedDict>
}

type SwatchPickedDict = AlphaColor;