import { Card, Button, Collapsible } from '@shopify/polaris';
import { ToolsMajor, ResetMinor } from '@shopify/polaris-icons';
import { useState, useEffect } from 'react';

import MobileDesktopSwitchPreview from './popup/preview/mobile_desktop_switch';
import PreviewPopup from './popup/preview';
import Formatter from './campaigns/new/formatter';
import OptionsCampaign from './campaigns/new/options';

const Design = ({ campaign, title, advanced = false, setCampaignProperty }) => {
  const [rerenderButton, setRerenderButton] = useState(false);
  const [preview, setPreview] = useState('desktop');
  const [formatter, setFormatter] = useState(advanced);
  const previewContainerClass =
    preview && !rerenderButton ? `salestorm-${preview}-preview-container` : '';
  const disclosure = formatter ? 'down' : 'up';
  useEffect(() => {
    if (window.Salestorm && window.Salestorm.hidePopup) {
      document.addEventListener(window.Salestorm.hidePopup.type, () => {
        setRerenderButton(true);
      });
    }
  }, []);
  return (
    <Card>
      <Card.Section title={title}>
        {rerenderButton && (
          <div className="salestorm-rerender-container">
            <Button
              onClick={() => {
                setRerenderButton(false);
                document
                  .getElementsByTagName('salestorm-popup')[0]
                  .setAttribute('visible', 'true');
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
      <Card.Section>
        <div className="salestorm-advanced-formatter-settings-toggle">
          <Button
            icon={ToolsMajor}
            onClick={() => {
              setFormatter(!formatter);
              setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
              }, 500);
            }}
            disclosure={disclosure}
            primary={formatter}
          >
            {' '}
            Advanced Settings, Styles and Texts
          </Button>
        </div>
      </Card.Section>
      <Collapsible
        open={formatter}
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
          <Formatter
            campaign={campaign}
            setCampaignProperty={setCampaignProperty}
          />
        </Card.Section>
      </Collapsible>
    </Card>
  );
};

export default Design;