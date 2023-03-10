import { getColors } from './picker/color';
import { PickerDrawer } from './picker/drawer';
import { Picker } from './picker/picker';

export async function main() {
  const colors = await getColors();
  const picker = new Picker(colors, {});
  const pickerDrawer = new PickerDrawer(picker);
}
