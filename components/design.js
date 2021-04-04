import { Card, Button, Collapsible } from '@shopify/polaris';
import {
  ToolsMajor,
  ResetMinor,
  ReplayMinor,
  ComposeMajor,
} from '@shopify/polaris-icons';
import { useState, useEffect } from 'react';

import MobileDesktopSwitchPreview from './popup/preview/mobile_desktop_switch';
import PreviewPopup from './popup/preview';
import Formatter from './campaigns/new/formatter';
import OptionsCampaign from './campaigns/new/options';
import quickThemes from './popup/templates/quickThemes';
import '../styles/components/design.css';

const SalestormTheme = ({ theme, name, setCampaignProperty }) => {
  const setTheme = () => setCampaignProperty(quickThemes(theme), 'styles');
  return (
    <div
      onClick={setTheme}
      onKeyDown={setTheme}
      className="salestorm-theme"
      style={{
        backgroundColor: quickThemes(theme).popup.backgroundColor,
        color: quickThemes(theme).popup.color,
        borderColor: quickThemes(theme).primaryButtons.backgroundColor,
        fontFamily: quickThemes(theme).popup.fontFamily,
        boxShadow: quickThemes(theme).popup.boxShadow,
      }}
    >
      {name.toUpperCase()}
    </div>
  );
};

const Design = ({
  campaign,
  title,
  advanced = false,
  setCampaignProperty,
  subtitle,
}) => {
  const [rerenderButton, setRerenderButton] = useState(false);
  const [preview, setPreview] = useState('desktop');
  const [options, setOptions] = useState(advanced);
  const [formatter, setFormatter] = useState(false);
  const previewContainerClass =
    preview && !rerenderButton ? `salestorm-${preview}-preview-container` : '';
  const disclosure = options ? 'down' : 'up';
  useEffect(() => {
    if (window.Salestorm && window.Salestorm.hidePopup) {
      document.addEventListener(window.Salestorm.hidePopup.type, () => {
        setRerenderButton(true);
      });
    }
  }, []);
  const replayAnimation = () => {
    const oldAnimation = campaign.styles.animation;
    setCampaignProperty(
      { ...campaign.styles, animation: { ...campaign.styles, type: '' } },
      'styles'
    );
    setTimeout(() => {
      setCampaignProperty(
        {
          ...campaign.styles,
          animation: { ...campaign.styles, type: oldAnimation.type },
        },
        'styles'
      );
    }, 200);
  };
  return (
    <Card>
      <Card.Section title={title}>
        {subtitle}
        <br />
        {rerenderButton && (
          <div className="salestorm-rerender-container">
            <Button
              onClick={() => {
                setRerenderButton(false);
                const popup = document.querySelector(
                  `#salestorm-campaign-${campaign.id}`
                );
                popup.setAttribute('currentoffer', '0');
                popup.setAttribute('visible', 'true');
              }}
              primary
              icon={ResetMinor}
            >
              show again
            </Button>
          </div>
        )}
        <div className={previewContainerClass}>
          <PreviewPopup campaign={campaign} preview={preview} />
        </div>
        <MobileDesktopSwitchPreview onSwitch={(value) => setPreview(value)} />
      </Card.Section>
      <Card.Section title="Click to apply quick themes.">
        <div className="salestorm-themes">
          <SalestormTheme
            theme="debut"
            name="Debut"
            setCampaignProperty={setCampaignProperty}
          />
          <SalestormTheme
            theme="gialloBistro"
            name="Giallo Bistro"
            setCampaignProperty={setCampaignProperty}
          />
          <SalestormTheme
            theme="warehouse"
            name="Warehouse"
            setCampaignProperty={setCampaignProperty}
          />
        </div>
        <div className="salestorm-themes">
          <SalestormTheme
            theme="galleriaempire"
            name="Galleria Empire"
            setCampaignProperty={setCampaignProperty}
          />
          <SalestormTheme
            theme="loftlawrence"
            name="Loft Lawrence"
            setCampaignProperty={setCampaignProperty}
          />
          <SalestormTheme
            theme="narrativecold"
            name="Narrative cold"
            setCampaignProperty={setCampaignProperty}
          />
        </div>
      </Card.Section>
      <Card.Section>
        <div className="salestorm-design-help">
          <Button primary icon={ReplayMinor} onClick={replayAnimation}>
            Replay incoming animation
          </Button>
          <a href="mailto:support@salestorm.cc?subject=Design%20Help%20Inquiry">
            <Button icon={ComposeMajor}>Get Help Designing</Button>
          </a>
        </div>
      </Card.Section>
      <Card.Section>
        <div className="salestorm-advanced-formatter-settings-toggle">
          <Button
            icon={ToolsMajor}
            onClick={() => {
              setOptions(!options);
              if (!formatter) {
                setFormatter(true);
              }
              setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
              }, 500);
            }}
            disclosure={disclosure}
            primary={options}
          >
            {' '}
            Advanced Settings, Styles and Texts
          </Button>
        </div>
      </Card.Section>
      <Collapsible
        open={options}
        transition={{
          duration: '500ms',
          timingFunction: 'ease-in-out',
        }}
        expandOnPrint
      >
        <Card.Section>
          <OptionsCampaign
            campaign={campaign}
            setCampaignProperty={setCampaignProperty}
          />
        </Card.Section>
        <Card.Section>
          {formatter && (
            <Formatter
              campaign={campaign}
              setCampaignProperty={setCampaignProperty}
            />
          )}
        </Card.Section>
      </Collapsible>
    </Card>
  );
};

export default Design;
