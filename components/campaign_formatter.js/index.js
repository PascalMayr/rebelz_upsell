import React, { useState, useCallback } from 'react';
import { Layout, Card, ChoiceList, TextField, Tabs } from '@shopify/polaris';
import SalestormColorPicker from './salestorm_color_picker';
import '../../styles/components_salestorm_campaign_formatter.css';
import BackgroundFormatter from './background_formatter';
import BorderFormatter from './border_formatter';
import BoxShadowFormatter from './boxshadow_formatter';

const CampaignFormatter = ({
  campaign,
  setCampaignProperty,
  isPreviewDesktop,
}) => {
  const tabs = [
    {
      id: 'popup',
      content: 'Popup',
      accessibilityLabel: 'Popup',
      panelID: 'popup-panel',
      styleChoices: [
        { label: 'Background', value: 'background', default: true },
        { label: 'Border', value: 'border' },
        { label: 'Box Shadow', value: 'boxShadow' },
      ],
    },
    {
      id: 'overlay',
      content: 'Overlay',
      accessibilityLabel: 'Overlay',
      panelID: 'overlay-panel',
      styleChoices: [
        { label: 'Background', value: 'background', default: true },
        { label: 'Border', value: 'border' },
      ],
    },
    {
      id: 'actionButton',
      content: 'Add to cart Button',
      accessibilityLabel: 'Add to cart Button',
      panelID: 'actionButton-panel',
      styleChoices: [
        { label: 'Background', value: 'background', default: true },
        { label: 'Border', value: 'border' },
        { label: 'Box Shadow', value: 'boxShadow' },
      ],
    },
    {
      id: 'animation',
      content: 'Animation',
      accessibilityLabel: 'Animation',
      panelID: 'animation-panel',
      styleChoices: [],
    },
  ];

  const [tab, setTab] = useState(0);

  const { id, styleChoices } = tabs[tab];

  const [styleChoice, setStyleChoice] = useState(
    styleChoices.find((styleChoice) => styleChoice.default)
  );

  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setStyleChoice(tabs[selectedTabIndex].styleChoices[0]);
      setTab(selectedTabIndex);
    },
    []
  );

  const setStyleProperty = useCallback(
    (value, styleKey) => {
      const currentPreviewStyleKey = isPreviewDesktop
        ? 'styles'
        : 'mobileStyles';
      const currentStyleObject = campaign[currentPreviewStyleKey][id];
      const newStyleObject = { ...currentStyleObject, [styleKey]: value };
      setCampaignProperty(
        { ...campaign[currentPreviewStyleKey], [id]: newStyleObject },
        currentPreviewStyleKey
      );
    },
    [isPreviewDesktop, campaign]
  );

  const styles = isPreviewDesktop
    ? campaign.styles[id]
    : campaign.mobileStyles[id];

  const _setColor = (value) => {
    if (styleChoice.value === 'boxShadow') {
      let boxShadow = styles.boxShadow.split(' ').slice(0, 3);
      setStyleProperty(`${boxShadow.join(' ')} ${value}`, styleChoice.value);
    } else {
      setStyleProperty(value, `${styleChoice.value}Color`);
    }
  };

  const _getColor = () =>
    styleChoice.value === 'boxShadow' && id !== 'overlay'
      ? styles[styleChoice.value].split(' ').slice(3).join(' ')
      : styles[`${styleChoice.value}Color`];
  const incomingAnimations = [
    {label: 'Back in down', value: 'animate__backInDown'},
    {label: 'Back in up', value: 'animate__backInUp'},
    {label: 'Fade in', value: 'animate__fadeIn'},
    {label: 'Fade in down', value: 'animate__fadeInDown'},
    {label: 'Fade in up', value: 'animate__fadeInUp'},
    {label: 'Light Speed in from right', value: 'animate__lightSpeedInRight'},
    {label: 'Light Speed in from left', value: 'animate__lightSpeedInLeft'},
    {label: 'Rotate in', value: 'animate__rotateIn'},
    {label: 'Jack in the Box', value: 'animate__jackInTheBox'},
    {label: 'Zoom in', value: 'animate__zoomIn'},
    {label: 'Flip in X', value: 'animate__flipInX'},
    {label: 'Flip in Y', value: 'animate__flipInY'},
    {label: 'Roll in', value: 'animate__rollIn'}
  ];

  const animationDelays = [
    {label: '0s', value: '0'},
    {label: '1s', value: '1'},
    {label: '2s', value: '2'},
    {label: '3s', value: '3'},
    {label: '4s', value: '4'},
    {label: '5s', value: '5'},
  ]

  const _replayAnimation = () => {
    let oldAnimation = campaign.animation;
    setCampaignProperty('', 'animation');
    setTimeout(() => {
      setCampaignProperty(oldAnimation, 'animation');
    }, 200)
  }

  return (
    <Layout>
      <Layout.Section>
        <Card>
          <Card.Section title="1.) Customize the Campaign Popup">
            <Tabs tabs={tabs} selected={tab} onSelect={handleTabChange}>
              <div id="salestorm-formatter">
                {id === 'popup' && (
                  <div className="salestorm-formatter-styles-height-width">
                    <TextField
                      label="Width"
                      value={styles.width}
                      onChange={(value) => setStyleProperty(value, 'width')}
                      placeholder="width"
                    />
                    <TextField
                      label="Height"
                      value={styles.height}
                      onChange={(value) => setStyleProperty(value, 'height')}
                      placeholder="height"
                    />
                  </div>
                )}
                <div className="salestorm-formatter-colors">
                  <div className="salestorm-formatter-choces">
                    <ChoiceList
                      choices={styleChoices}
                      selected={styleChoice.value}
                      onChange={(option) => {
                        setStyleChoice(
                          styleChoices.find(
                            (choice) => choice.value === option[0]
                          )
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
                  <div className="salestorm-formatter-styles">
                    {styleChoice.value === 'background' && (
                      <BackgroundFormatter
                        styles={styles}
                        setStyleProperty={setStyleProperty}
                {
                  id === 'animation' &&
                  <div className='salestorm-formatter-styles-animation-container'>
                    <div className='salestorm-formatter-styles-animation'>
                      <Select
                        label='Incoming Animation'
                        options={incomingAnimations}
                        onChange={(value) => {
                          setCampaignProperty(value, 'animation');
                        }}
                        value={campaign.animation}
                      />
                      <Select
                        label='Animation delay'
                        options={animationDelays}
                        onChange={(value) => {
                          setCampaignProperty(value, 'animation_delay');
                        }}
                        value={campaign.animation_delay}
                      />
                    </div>
                    <Button icon={ReplayMinor} primary onClick={_replayAnimation}>Replay Animation</Button>
                  </div>
                }
                      />
                    )}
                  </div>
                </div>
              </div>
            </Tabs>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export default CampaignFormatter;
