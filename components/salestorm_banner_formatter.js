import { useState, useCallback } from 'react'
import { RangeSlider, Layout, Card, ChoiceList, TextField, Checkbox } from '@shopify/polaris';
import SalestormColorPicker from './salestorm_color_picker';
import '../styles/components_salestorm_banner_formatter.css';

const SaleStormBannerFormatter = ({ campaign, handleCampaignChange }) => {

  const handleStyleChange = useCallback(
    (value, id) => {
      handleCampaignChange({...campaign.styles, [id]: value}, 'styles')
    },
    [campaign],
  );

  const [color, setColor] = useState({label: 'Background color', value: 'backgroundColor'});

  const colorChoices = [
    {label: 'Background color', value: 'backgroundColor'},
    {label: 'Border color', value: 'borderColor'},
    {label: 'Box Shadow color', value: 'shadowColor'},
  ];

  const [sides, setSides] = useState({
    left: true,
    right: true,
    top: true,
    bottom: true
  });

  return (
  <Layout>
    {
    /*
    <Layout.Section>
      <Card>
        <Card.Section title="Pick which side of the banner you want to edit.">
              <div className='salestorm-banner-formatter-sides'>
            <Checkbox
              label="Apply styles to leftside"
              checked={sides.left}
              onChange={(value) => setSides({...sides, left: value})}
            />
            <Checkbox
              label="Apply styles to rightside"
              checked={sides.right}
              onChange={(value) => setSides({...sides, right: value})}
            />
            <Checkbox
              label="Apply styles to topside"
              checked={sides.top}
              onChange={(value) => setSides({...sides, top: value})}
            />
            <Checkbox
              label="Apply styles to bottomside"
              checked={sides.bottom}
              onChange={(value) => setSides({...sides, bottom: value})}
            />
          </div>
          </Card.Section>
        </Card>
      </Layout.Section>
      */
    }
    <Layout.Section>
      <Card>
        <Card.Section title="Pick your colors">
          <div className="salestorm-banner-formatter-colors">
            <div>
              <ChoiceList
                choices={colorChoices}
                selected={color.value}
                onChange={(option) => {
                  setColor(colorChoices.find(choice => choice.value === option[0]))
                }}
              />
            </div>
            <SalestormColorPicker
              onChange={(value) => handleStyleChange(value, color.value)}
              onTextChange={(value) => handleStyleChange(value, color.value)}
              color={campaign.styles[color.value]}
              allowAlpha
            />
          </div>
        </Card.Section>
      </Card>
    </Layout.Section>
    <Layout.Section>
      <Card>
        <Card.Section title="Set styles">
          <div className="salestorm-banner-formatter-styles">
            <RangeSlider
              label="Margin in px"
              value={parseInt(campaign.styles.margin)}
              onChange={(value) => handleStyleChange(`${value}px`, 'margin')}
              output
            />
            <RangeSlider
              label="Padding in px"
              value={parseInt(campaign.styles.padding)}
              onChange={(value) => handleStyleChange(`${value}px`, 'padding')}
              output
            />
            <RangeSlider
              label="Border Radius in px"
              value={parseInt(campaign.styles.borderRadius)}
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