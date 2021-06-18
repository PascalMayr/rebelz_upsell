import { ColorPicker, TextField } from '@shopify/polaris';
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

const ColorPickerFormatter = ({
  onChange,
  color,
  allowAlpha = false,
  id,
  onTextChange,
  ...props
}) => {
  const colorMode = allowAlpha ? 'rgb' : 'hex';
  const { h, s, l, a } = tinycolor(color).toHsl();
  const colorForPicker = { hue: h, saturation: s, brightness: l, alpha: a };
  return (
    <div className="color-picker" {...props}>
      <ColorPicker
        onChange={(value) => {
          onChange(getColorFromColorPicker(value, colorMode));
        }}
        color={colorForPicker}
        allowAlpha={allowAlpha}
        id={id}
      />
      <div
        className="picked-color"
        style={{
          backgroundColor: getColorFromColorPicker(colorForPicker, colorMode),
        }}
      >
        <TextField
          value={color}
          onChange={(value) => onTextChange(value)}
          placeholder="Insert a rgba or hex value"
        />
      </div>
    </div>
  );
};

export default ColorPickerFormatter;
