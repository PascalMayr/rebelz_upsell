import hslaFromPicker from './hsla_from_picker';

const getColorFromColorPicker = (colorPickerValues) => {
  const hslaCSSValues = hslaFromPicker(colorPickerValues);
  return `hsla(${hslaCSSValues.hue}, ${hslaCSSValues.saturation}, ${hslaCSSValues.brightness}, ${hslaCSSValues.alpha})`;
}

export default getColorFromColorPicker