import { useState, useCallback, Fragment } from 'react';
import {
  RangeSlider,
  Layout,
  Card,
  ChoiceList,
  TextField,
  Checkbox,
} from '@shopify/polaris';
import SalestormColorPicker from './salestorm_color_picker';
import '../styles/components_salestorm_banner_formatter.css';

const SaleStormBannerFormatter = ({ campaign, setStyleProperty }) => {

  const [styleChoice, setStyleChoice] = useState({
    label: 'Background',
    value: 'background',
  });

  const styleChoices = [
    { label: 'Background', value: 'background' },
    { label: 'Border', value: 'border' },
    { label: 'Box Shadow', value: 'boxShadow' },
  ];

  const _setColor = (value) => {
    if (styleChoice.value === 'boxShadow') {
      let boxShadow = campaign.styles.boxShadow.split(' ').slice(0, 3);
      setStyleProperty(`${boxShadow.join(' ')} ${value}`, styleChoice.value);
    } else {
      setStyleProperty(value, `${styleChoice.value}Color`);
    }
  };

  const _getColor = (value) =>
    styleChoice.value === 'boxShadow'
      ? campaign.styles[styleChoice.value].split(' ').slice(3).join(' ')
      : campaign.styles[`${styleChoice.value}Color`];

  return (
    <Layout>
      <Layout.Section>
        <Card>
            <div className='salestorm-banner-formatter-styles-height-width'>
              <TextField
                label="Popup width"
                value={campaign.styles.width}
                onChange={(value) => setStyleProperty(value, 'width')}
                placeholder='width'
              />
              <TextField
                label="Popup height"
                value={campaign.styles.height}
                onChange={(value) => setStyleProperty(value, 'height')}
                placeholder='height'
              />
            </div>
            <div className="salestorm-banner-formatter-colors">
              <div>
                <ChoiceList
                  choices={styleChoices}
                  selected={styleChoice.value}
                  onChange={(option) => {
                    setStyleChoice(
                      styleChoices.find((choice) => choice.value === option[0])
                    );
                  }}
                />
              </div>
              {['border', 'background', 'boxShadow'].includes(
                styleChoice.value
              ) && (
                <SalestormColorPicker
                  onChange={_setColor}
                  onTextChange={_setColor}
                  color={_getColor()}
                  allowAlpha
                />
              )}
              <div className="salestorm-banner-formatter-styles">
                {
                  styleChoice.value === 'background' &&
                  <TextField label="Background Image URL"
                    value={campaign.styles.backgroundImage.match(/\((.*?)\)/)[1]}
                    onChange={(value) => {
                    let backgroundImage = campaign.styles.backgroundImage;
                    const backgroundImageUrl = backgroundImage.match(/\((.*?)\)/)[1];
                    if (backgroundImageUrl === '') {
                      backgroundImage = backgroundImage.replace(backgroundImage, `url(${value})`);
                    }
                    else {
                      backgroundImage = backgroundImage.replace(backgroundImageUrl, value);
                    }
                    setStyleProperty(backgroundImage, 'backgroundImage');
                  }} />
                }
                {styleChoice.value === 'border' && (
                  <Fragment>
                    <div className="salestormm-banner-formatter-border-sides">
                      <div>
                        <Checkbox
                          label="Apply to the left"
                          checked={
                            campaign.styles.borderWidth.split(' ')[3] !== '0px'
                          }
                          onChange={(value) => {
                            let borderWidth = campaign.styles.borderWidth.split(
                              ' '
                            );
                            const leftWidth = value
                              ? borderWidth.find((width) => width !== '0px')
                              : '0px';
                            borderWidth[3] = leftWidth;
                            setStyleProperty(
                              borderWidth.join(' '),
                              'borderWidth'
                            );
                          }}
                        />
                        <Checkbox
                          label="Apply to the right"
                          checked={
                            campaign.styles.borderWidth.split(' ')[1] !== '0px'
                          }
                          onChange={(value) => {
                            let borderWidth = campaign.styles.borderWidth.split(
                              ' '
                            );
                            const rightWidth = value
                              ? borderWidth.find((width) => width !== '0px')
                              : '0px';
                            borderWidth[1] = rightWidth;
                            setStyleProperty(
                              borderWidth.join(' '),
                              'borderWidth'
                            );
                          }}
                        />
                      </div>
                      <div>
                        <Checkbox
                          label="Apply to the top"
                          checked={
                            campaign.styles.borderWidth.split(' ')[0] !== '0px'
                          }
                          onChange={(value) => {
                            let borderWidth = campaign.styles.borderWidth.split(
                              ' '
                            );
                            const topWidth = value
                              ? borderWidth.find((width) => width !== '0px')
                              : '0px';
                            borderWidth[0] = topWidth;
                            setStyleProperty(
                              borderWidth.join(' '),
                              'borderWidth'
                            );
                          }}
                        />
                        <Checkbox
                          label="Apply to the bottom"
                          checked={
                            campaign.styles.borderWidth.split(' ')[2] !== '0px'
                          }
                          onChange={(value) => {
                            let borderWidth = campaign.styles.borderWidth.split(
                              ' '
                            );
                            const bottomWidth = value
                              ? borderWidth.find((width) => width !== '0px')
                              : '0px';
                            borderWidth[2] = bottomWidth;
                            setStyleProperty(
                              borderWidth.join(' '),
                              'borderWidth'
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="salestorm-banner-formatter-range">
                      <RangeSlider
                        label="Border Radius in px"
                        value={parseInt(campaign.styles.borderRadius)}
                        onChange={(value) =>
                          setStyleProperty(`${value}px`, 'borderRadius')
                        }
                        output
                      />
                    </div>
                    <div className="salestorm-banner-formatter-range">
                      <RangeSlider
                        label="Border width in px"
                        value={parseInt(
                          campaign.styles.borderWidth
                            .split(' ')
                            .find((width) => width !== '0px')
                            ? campaign.styles.borderWidth
                                .split(' ')
                                .find((width) => width !== '0px')
                            : 0
                        )}
                        onChange={(value) => {
                          let borderWidth = campaign.styles.borderWidth.split(
                            ' '
                          );
                          borderWidth = borderWidth.map((width) =>
                            width !== '0px' ? `${value}px` : '0px'
                          );
                          if (!borderWidth.find((width) => width !== '0px')) {
                            borderWidth = [
                              `${value}px`,
                              `${value}px`,
                              `${value}px`,
                              `${value}px`,
                            ];
                          }
                          setStyleProperty(
                            borderWidth.join(' '),
                            'borderWidth'
                          );
                        }}
                        output
                      />
                    </div>
                  </Fragment>
                )}
                {styleChoice.value === 'boxShadow' && (
                  <Fragment>
                    <div className="salestorm-banner-formatter-range">
                      <RangeSlider
                        label="Shadow H offset"
                        value={parseInt(
                          campaign.styles.boxShadow.split(' ')[0]
                        )}
                        onChange={(value) => {
                          let currentBoxShadow = campaign.styles.boxShadow.split(
                            ' '
                          );
                          currentBoxShadow[0] = `${value}px`;
                          setStyleProperty(
                            currentBoxShadow.join(' '),
                            'boxShadow'
                          );
                        }}
                        output
                      />
                    </div>
                    <div className="salestorm-banner-formatter-range">
                      <RangeSlider
                        label="Shadow V offset"
                        value={parseInt(
                          campaign.styles.boxShadow.split(' ')[1]
                        )}
                        onChange={(value) => {
                          let currentBoxShadow = campaign.styles.boxShadow.split(
                            ' '
                          );
                          currentBoxShadow[1] = `${value}px`;
                          setStyleProperty(
                            currentBoxShadow.join(' '),
                            'boxShadow'
                          );
                        }}
                        output
                      />
                    </div>
                    <div className="salestorm-banner-formatter-range">
                      <RangeSlider
                        label="Shadow spread"
                        value={parseInt(
                          campaign.styles.boxShadow.split(' ')[2]
                        )}
                        onChange={(value) => {
                          let currentBoxShadow = campaign.styles.boxShadow.split(
                            ' '
                          );
                          currentBoxShadow[2] = `${value}px`;
                          setStyleProperty(
                            currentBoxShadow.join(' '),
                            'boxShadow'
                          );
                        }}
                        output
                      />
                    </div>
                  </Fragment>
                )}
              </div>
            </div>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export default SaleStormBannerFormatter;
