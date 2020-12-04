import { ColorPicker, TextField } from '@shopify/polaris';
import getColorFromColorPicker from '../utils/get_color_from_color_picker';
import '../styles/components_salestorm_color_picker.css';

const SalestormColorPicker = ({onChange, color, allowAlpha = false, id, onTextChange, label, ...props}) => {
  return (
    <div className='salestorm-color-picker' {...props}>
      <label>{label}</label>
      <ColorPicker
        onChange={onChange}
        color={color}
        allowAlpha={allowAlpha}
        id={id}
      />
      <div
        className="salestorm-picked-color"
        style={{backgroundColor: getColorFromColorPicker(color)}}
      >
        <TextField
          value={getColorFromColorPicker(color)}
          disabled
        />
      </div>
    </div>
  )
}

export default SalestormColorPicker