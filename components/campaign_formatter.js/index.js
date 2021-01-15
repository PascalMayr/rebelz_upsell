import { useState, useCallback, useMemo } from 'react';
import {
  Layout,
  Card,
  ChoiceList,
  TextField,
  Tabs,
  Select,
  Button,
} from '@shopify/polaris';
import { ReplayMinor } from '@shopify/polaris-icons';

import SalestormColorPicker from './salestorm_color_picker';
import '../../styles/components_salestorm_campaign_formatter.css';
import BackgroundFormatter from './background_formatter';
import BorderFormatter from './border_formatter';
import BoxShadowFormatter from './boxshadow_formatter';
import TextFormatter from './text_formatter';

const CampaignFormatter = ({
  campaign,
  setCampaignProperty,
  isPreviewDesktop,
}) => {
  const tabs = useMemo(
    () => [
      {
        id: 'popup',
        content: 'Popup',
        accessibilityLabel: 'Popup',
        panelID: 'popup-panel',
        styleChoices: [
          { label: 'Background', value: 'background', default: true },
          { label: 'Border', value: 'border' },
          { label: 'Box Shadow', value: 'boxShadow' },
          { label: 'Text', value: 'color' },
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
        id: 'secondaryButtons',
        content: 'Close Button',
        accessibilityLabel: 'Close Button',
        panelID: 'secondaryButtons-panel',
        styleChoices: [
          { label: 'Background', value: 'background', default: true },
          { label: 'Border', value: 'border' },
          { label: 'Box Shadow', value: 'boxShadow' },
          { label: 'Icon Color', value: 'fill' },
        ],
      },
      {
        id: 'primaryButtons',
        content: 'Claim Offer Button',
        accessibilityLabel: 'Claim Offer Button',
        panelID: 'primaryButtons-panel',
        styleChoices: [
          { label: 'Background', value: 'background', default: true },
          { label: 'Border', value: 'border' },
          { label: 'Box Shadow', value: 'boxShadow' },
          { label: 'Text', value: 'color' },
        ],
      },
      {
        id: 'animation',
        content: 'Animation',
        accessibilityLabel: 'Animation',
        panelID: 'animation-panel',
        styleChoices: [],
      },
      {
        id: 'customCSS',
        content: 'Custom CSS',
        accessibilityLabel: 'Custom CSS',
        panelID: 'customCSS-panel',
        styleChoices: [],
      },
      {
        id: 'customJS',
        content: 'Custom Javascript',
        accessibilityLabel: 'Custom Javascript',
        panelID: 'customJS-panel',
        styleChoices: [],
      },
    ],
    []
  );

  const [tab, setTab] = useState(0);

  const { id, styleChoices } = tabs[tab];

  const [styleChoice, setStyleChoice] = useState(
    styleChoices.find((choice) => choice.default)
  );

  const handleTabChange = useCallback(
    (selectedTabIndex) => {
      setStyleChoice(tabs[selectedTabIndex].styleChoices[0]);
      setTab(selectedTabIndex);
    },
    [tabs]
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
    [isPreviewDesktop, id, campaign, setCampaignProperty]
  );

  const styles = isPreviewDesktop
    ? campaign.styles[id]
    : campaign.mobileStyles[id];

  const _getBoxshadowWithoutColor = (boxShadow) =>
    boxShadow.split(' ').slice(0, 3).join(' ');

  const _getBoxshadowColor = (boxShadow) =>
    boxShadow.split(' ').slice(3).join(' ');

  const _setColor = (value) => {
    switch (styleChoice.value) {
      case 'boxShadow':
        setStyleProperty(
          `${_getBoxshadowWithoutColor(styles.boxShadow)} ${value}`,
          styleChoice.value
        );
        break;
      case 'fill':
        setStyleProperty(value, styleChoice.value);
        break;
      case 'color':
        setStyleProperty(value, styleChoice.value);
        break;
      default:
        setStyleProperty(value, `${styleChoice.value}Color`);
    }
  };

  const _getColor = () => {
    switch (styleChoice.value) {
      case 'boxShadow':
        return _getBoxshadowColor(styles[styleChoice.value]);
      case 'fill':
        return styles[styleChoice.value];
      case 'color':
        return styles[styleChoice.value];
      default:
        return styles[`${styleChoice.value}Color`];
    }
  };

  const animationTypes = [
    { label: 'Back in down', value: 'animate__backInDown' },
    { label: 'Back in up', value: 'animate__backInUp' },
    { label: 'Fade in', value: 'animate__fadeIn' },
    { label: 'Fade in down', value: 'animate__fadeInDown' },
    { label: 'Fade in up', value: 'animate__fadeInUp' },
    { label: 'Light Speed in from right', value: 'animate__lightSpeedInRight' },
    { label: 'Light Speed in from left', value: 'animate__lightSpeedInLeft' },
    { label: 'Rotate in', value: 'animate__rotateIn' },
    { label: 'Jack in the Box', value: 'animate__jackInTheBox' },
    { label: 'Zoom in', value: 'animate__zoomIn' },
    { label: 'Flip in X', value: 'animate__flipInX' },
    { label: 'Flip in Y', value: 'animate__flipInY' },
    { label: 'Roll in', value: 'animate__rollIn' },
  ];

  const animationSpeeds = [
    { label: 'Slow', value: 'slow' },
    { label: 'Slower', value: 'slower' },
    { label: 'Normal', value: 'normal' },
    { label: 'Fast', value: 'fast' },
    { label: 'Faster', value: 'faster' },
  ];

  const _replayAnimation = () => {
    const oldAnimation = campaign.animation;
    setCampaignProperty(
      { type: '', delay: oldAnimation.delay, speed: oldAnimation.speed },
      'animation'
    );
    setTimeout(() => {
      setCampaignProperty(oldAnimation, 'animation');
    }, 200);
  };

  return (
    <Layout>
      <Layout.Section>
        <Card>
          <Card.Section title="Customize the Popup">
            <Tabs tabs={tabs} selected={tab} onSelect={handleTabChange}>
              <div id="salestorm-formatter">
                {id === 'customCSS' && (
                  <TextField
                    placeholder="/* Use this field to add custom CSS &hearts; */"
                    value={campaign.customCSS}
                    onChange={(value) => {
                      setCampaignProperty(value, 'customCSS');
                    }}
                    multiline={6}
                  />
                )}
                {id === 'customJS' && (
                  <TextField
                    placeholder="/* Use this field to add custom Javascript &hearts; */"
                    value={campaign.customJS}
                    onChange={(value) => {
                      setCampaignProperty(value, 'customJS');
                    }}
                    multiline={6}
                  />
                )}
                {id === 'animation' && (
                  <div className="salestorm-formatter-styles-animation-container">
                    <div className="salestorm-formatter-styles-animation">
                      <Select
                        label="Incoming Animation"
                        options={animationTypes}
                        onChange={(value) => {
                          setCampaignProperty(
                            { ...campaign.animation, type: value },
                            'animation'
                          );
                        }}
                        value={campaign.animation.type}
                      />
                      <TextField
                        label="Animation delay in seconds"
                        type="number"
                        onChange={(value) => {
                          if (value >= 0) {
                            setCampaignProperty(
                              { ...campaign.animation, delay: value },
                              'animation'
                            );
                          }
                        }}
                        value={`${campaign.animation.delay}`}
                      />
                    </div>
                    <div className="salestorm-formatter-styles-animation">
                      <Select
                        label="Animation Speed"
                        options={animationSpeeds}
                        onChange={(value) => {
                          setCampaignProperty(
                            { ...campaign.animation, speed: value },
                            'animation'
                          );
                        }}
                        value={campaign.animation.speed}
                      />
                      <div className="salestorm-formatter-styles-animation-repeat">
                        <Button
                          icon={ReplayMinor}
                          primary
                          onClick={_replayAnimation}
                        >
                          Replay incoming Animation
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {styleChoices.length > 0 && (
                  <div className="salestorm-formatter-colors">
                    <div className="salestorm-formatter-choces">
                      {styleChoices.length > 1 && (
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
                      )}
                    </div>
                    {[
                      'border',
                      'background',
                      'boxShadow',
                      'fill',
                      'color',
                    ].includes(styleChoice.value) && (
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
                        />
                      )}
                      {styleChoice.value === 'border' && (
                        <BorderFormatter
                          styles={styles}
                          setStyleProperty={setStyleProperty}
                        />
                      )}
                      {styleChoice.value === 'boxShadow' && (
                        <BoxShadowFormatter
                          styles={styles}
                          setStyleProperty={setStyleProperty}
                        />
                      )}
                      {styleChoice.value === 'color' && (
                        <TextFormatter
                          styles={styles}
                          setStyleProperty={setStyleProperty}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Tabs>
          </Card.Section>
        </Card>
      </Layout.Section>
    </Layout>
  );
};

export default CampaignFormatter;
