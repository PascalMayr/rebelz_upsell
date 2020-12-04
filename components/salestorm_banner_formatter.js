import { useState, useCallback } from 'react'
import { RangeSlider, Layout, Card, ChoiceList, TextField } from '@shopify/polaris';
import SalestormColorPicker from './salestorm_color_picker';
import '../styles/components_salestorm_banner_formatter.css';

const SaleStormBannerFormatter = () => {

  const [bannerStyles, setRangeValue] = useState({
      margin: '0px',
      padding: '0px',
      borderRadius: '20px',
      backgroundColor: { hue: 0, saturation: 1, brightness: 0.6, alpha: 1 },
      borderColor: { hue: 0, saturation: 1, brightness: 0.6, alpha: 1 },
      shadowColor: { hue: 0, saturation: 1, brightness: 0.6, alpha: 1 },
      width: '100%',
      height: '200px',
      boxShadow: 'none'
    }
  );

  const handleStyleChange = useCallback(
    (value, id) => {
      setRangeValue({...bannerStyles, [id]: value });
    },
    [bannerStyles],
  );

  const [color, setColor] = useState({label: 'Background color', value: 'backgroundColor'});

  const colorChoices = [
    {label: 'Background color', value: 'backgroundColor'},
    {label: 'Border color', value: 'borderColor'},
    {label: 'Box Shadow color', value: 'shadowColor'},
  ];

  return (
  <Layout>
    <Layout.Section oneHalf>
      <Card>
        <Card.Section title="Pick your colors">
          <div className="salestorm-banner-formatter-colors">
            <div>
              <ChoiceList
                choices={colorChoices}
                selected={color.value}
                onChange={(option) => {setColor(colorChoices.find(choice => choice.value === option[0]))}}
              />
            </div>
            <SalestormColorPicker
              onChange={(value) => handleStyleChange(value, color.value)}
              onTextChange={(value) => {}}
              color={bannerStyles[color.value]}
              allowAlpha
            />
          </div>
        </Card.Section>
      </Card>
    </Layout.Section>
    <Layout.Section oneThird>
      <Card>
        <Card.Section title="Set styles">
          <div className="salestorm-banner-formatter-styles">
            <RangeSlider
              label="Margin in px"
              value={parseInt(bannerStyles.margin)}
              onChange={(value) => handleStyleChange(`${value}px`, 'margin')}
              output
            />
            <RangeSlider
              label="Padding in px"
              value={parseInt(bannerStyles.padding)}
              onChange={(value) => handleStyleChange(`${value}px`, 'padding')}
              output
            />
            <RangeSlider
              label="Border Radius in px"
              value={parseInt(bannerStyles.borderRadius)}
              onChange={(value) => handleStyleChange(`${value}px`, 'borderRadius')}
              output
            />
            <div className='salestorm-banner-formatter-styles-height-width'>
              <TextField placeholder='width' />
              <TextField placeholder='height' />
            </div>
          </div>
        </Card.Section>
      </Card>
    </Layout.Section>
  </Layout>
)}

export default SaleStormBannerFormatter