const hslaFromPicker = (colorPickerValues, css = true) => {
  return{
    hue: Math.trunc(colorPickerValues.hue),
    saturation: css ? `${Math.trunc(colorPickerValues.saturation * 100)}%` : Math.trunc(colorPickerValues.saturation * 100),
    brightness: css ? `${Math.trunc(colorPickerValues.brightness * 100)}%` : Math.trunc(colorPickerValues.brightness * 100),
    alpha: parseFloat(parseFloat(colorPickerValues.alpha).toFixed(2))
  }
}

export default hslaFromPicker
