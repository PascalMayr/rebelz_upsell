import { useState, useCallback, Fragment } from "react";
import {
  RangeSlider,
  Layout,
  Card,
  ChoiceList,
  TextField,
  Checkbox,
} from "@shopify/polaris";
import SalestormColorPicker from "./salestorm_color_picker";
import "../styles/components_salestorm_banner_formatter.css";

const SaleStormBannerFormatter = ({ campaign, setCampaignProperty }) => {
  const setStyleProperty = useCallback(
    (value, id) => {
      if (id === "boxShadow") {
        let boxShadow = campaign.styles.boxShadow.split(" ").slice(0, 3);
        setCampaignProperty(
          { ...campaign.styles, [id]: `${boxShadow.join(" ")} ${value}` },
          "styles"
        );
      } else {
        setCampaignProperty({ ...campaign.styles, [id]: value }, "styles");
      }
    },
    [campaign]
  );

  const [styleChoice, setStyleChoice] = useState({label: 'Background', value: 'background'});

  const styleChoices = [
    {label: 'Background', value: 'background'},
    {label: 'Border', value: 'border'},
    {label: 'Box Shadow', value: 'boxShadow'},
  ];

  return (
  <Layout>
    <Layout.Section>
      <Card>
        <Card.Section title="Set Banner Styles">
          <div className="salestorm-banner-formatter-colors">
            <div>
              <ChoiceList
                choices={styleChoices}
                selected={styleChoice.value}
                onChange={(option) => {
                  setStyleChoice(styleChoices.find(choice => choice.value === option[0]))
                }}
              />
            </div>
            <SalestormColorPicker
              onChange={(value) => setStyleProperty(value, styleChoice.value === 'boxShadow' ? styleChoice.value : `${styleChoice.value}Color`)}
              onTextChange={(value) => setStyleProperty(value, styleChoice.value === 'boxShadow' ? styleChoice.value : `${styleChoice.value}Color`)}
              color={styleChoice.value === 'boxShadow' ? campaign.styles[styleChoice.value].split(' ').slice(3).join(' ') : campaign.styles[`${styleChoice.value}Color`]}
              allowAlpha
            />
            <div className="salestorm-banner-formatter-styles">
              {
                styleChoice.value === 'border' &&
                <Fragment>
                  <div className='salestormm-banner-formatter-border-sides'>
                    <div>
                      <Checkbox
                        label="Apply styles to the leftside"
                        checked={campaign.styles.borderLeftWidth !== '0px'}
                        onChange={(value) => {
                          setStyleProperty(value ? campaign.styles.borderWidth : '0px', 'borderLeftWidth')
                        }}
                      />
                      <Checkbox
                        label="Apply styles to the rightside"
                        checked={campaign.styles.borderRightWidth !== '0px'}
                        onChange={(value) => {
                          setStyleProperty(value ? campaign.styles.borderWidth : '0px', 'borderRightWidth')
                        }}
                      />
                    </div>
                    <div>
                      <Checkbox
                        label="Apply styles to the topside"
                        checked={campaign.styles.borderTopWidth !== '0px'}
                        onChange={(value) => {
                          setStyleProperty(value ? campaign.styles.borderWidth : '0px', 'borderTopWidth')
                        }}
                      />
                      <Checkbox
                        label="Apply styles to the bottomside"
                        checked={campaign.styles.borderBottomWidth !== '0px'}
                        onChange={(value) => {
                          setStyleProperty(value ? campaign.styles.borderWidth : '0px', 'borderBottomWidth')
                        }}
                      />
                    </div>
                  </div>
                  <div className='salestorm-banner-formatter-range'>
                    <RangeSlider
                      label="Border Radius in px"
                      value={parseInt(campaign.styles.borderRadius)}
                      onChange={(value) => setStyleProperty(`${value}px`, 'borderRadius')}
                      output
                    />
                  </div>
                  <div className='salestorm-banner-formatter-range'>
                    <RangeSlider
                      label="Border width in px"
                      value={parseInt(campaign.styles.borderWidth)}
                      onChange={(value) => {
                        setStyleProperty(`${value}px`, 'borderWidth');
                      }}
                      output
                    />
                  </div>
                </Fragment>
              }
              {
                styleChoice.value === 'boxShadow' &&
                <Fragment>
                  <div className='salestorm-banner-formatter-range'>
                    <RangeSlider
                      label="Shadow H offset"
                      value={parseInt(campaign.styles.boxShadow.split(' ')[0])}
                      onChange={(value) => {

                      }}
                      output
                    />
                  </div>
                  <div className='salestorm-banner-formatter-range'>
                    <RangeSlider
                      label="Shadow V offset"
                      value={parseInt(campaign.styles.boxShadow.split(' ')[1])}
                      onChange={(value) => {

                      }}
                      output
                    />
                  </div>
                  <div className='salestorm-banner-formatter-range'>
                    <RangeSlider
                      label="Shadow spread"
                      value={parseInt(campaign.styles.boxShadow.split(' ')[2])}
                      onChange={(value) => {

                      }}
                      output
                    />
                  </div>
                </Fragment>
              }
            </div>
          </div>
        </Card.Section>
        <Card.Section>
          <div className='salestorm-banner-formatter-range'>
            <RangeSlider
              label="Margin in px"
              value={parseInt(campaign.styles.margin)}
              onChange={(value) => setStyleProperty(`${value}px`, 'margin')}
              output
            />
          </div>
          <div className='salestorm-banner-formatter-range'>
            <RangeSlider
              label="Padding in px"
              value={parseInt(campaign.styles.padding)}
              onChange={(value) => setStyleProperty(`${value}px`, 'padding')}
              output
            />
          </div>
          <div className='salestorm-banner-formatter-styles-height-width'>
            <TextField
              placeholder='width'
              value={campaign.styles.width}
              onChange={(value) => setStyleProperty(value, 'width')}
            />
            <TextField
              placeholder='height'
              value={campaign.styles.height}
              onChange={(value) => setStyleProperty(value, 'height')}
            />
          </div>
        </Card.Section>
      </Card>
    </Layout.Section>
  </Layout>
)}

export default SaleStormBannerFormatter;
