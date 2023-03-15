import { getColors } from './color/color';
import { PaletteDrawer } from './palette/drawer';
import { PickerDrawer } from './picker/drawer';

export async function main() {
  const colors = await getColors();
  const palette = new PaletteDrawer();
  const picker = new PickerDrawer(colors, {});
  picker.addEventListener('swatch-picked', (ev) => {
    console.log(`selected ${JSON.stringify(ev.detail)}`);
    palette.add(ev.detail);
  });
}
