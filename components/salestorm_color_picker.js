import { ColorPicker, TextField } from '@shopify/polaris';
import getColorFromColorPicker from '../utils/get_color_from_color_picker';
import '../styles/components_salestorm_color_picker.css';
import tinycolor from 'tinycolor2';

const SalestormColorPicker = ({onChange, color, allowAlpha = false, id, onTextChange, label, ...props}) => {
  const colorMode = allowAlpha ? 'rgb' : 'hex';
  const {h, s, l, a} = tinycolor(color).toHsl();
  const colorForPicker = {hue: h, saturation: s, brightness: l, alpha: a};
  return (
    <div className='salestorm-color-picker' {...props}>
      <label>{label}</label>
      <ColorPicker
        onChange={(value) => {
          onChange(getColorFromColorPicker(value, colorMode))
        }}
        color={colorForPicker}
        allowAlpha={allowAlpha}
        id={id}
      />
      <div
        className="salestorm-picked-color"
        style={{backgroundColor: getColorFromColorPicker(colorForPicker, colorMode)}}
      >
        <TextField
          value={getColorFromColorPicker(colorForPicker, colorMode)}
          onChange={value => {
            onTextChange(value);
          }}
        />
      </div>
    </div>
  )
}

export default SalestormColorPicker