import { ColorPicker, TextField } from '@shopify/polaris';
import '../../styles/components_salestorm_color_picker.css';
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

const SalestormColorPicker = ({
  onChange,
  color,
  allowAlpha = false,
  id,
  onTextChange,
  label,
  ...props
}) => {
  const colorMode = allowAlpha ? 'rgb' : 'hex';
  const { h, s, l, a } = tinycolor(color).toHsl();
  const colorForPicker = { hue: h, saturation: s, brightness: l, alpha: a };
  return (
    <div className="salestorm-color-picker" {...props}>
      <label>{label}</label>
      <ColorPicker
        onChange={(value) => {
          onChange(getColorFromColorPicker(value, colorMode));
        }}
        color={colorForPicker}
        allowAlpha={allowAlpha}
        id={id}
      />
      <div
        className="salestorm-picked-color"
        style={{
          backgroundColor: getColorFromColorPicker(colorForPicker, colorMode),
        }}
      >
        <TextField value={color} onChange={(value) => onTextChange(value)} />
      </div>
    </div>
  );
};

export default SalestormColorPicker;