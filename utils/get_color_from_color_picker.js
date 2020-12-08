import tinycolor from 'tinycolor2';

const getColorFromColorPicker = (pickedColor, colorModel) => {
  const { hue, saturation, brightness, alpha } = pickedColor;
  const color = tinycolor({ h: hue, s: saturation, l: brightness, a: alpha });
  switch (colorModel) {
    case 'rgb':
      return color.toRgbString();
    case 'hsl':
      return color.toHslString();
    default:
      return color.toHex8String();
  }
};

export default getColorFromColorPicker;
