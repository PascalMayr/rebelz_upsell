import '../styles/components_preview_switch.css';
import { Button } from '@shopify/polaris';
import { DesktopMajor, TabletMajor, MobileMajor } from '@shopify/polaris-icons';
import { useState } from 'react';

const CampaignPreviewSwitch = ({ onSwitch }) => {
  const [selected, setSelected] = useState('desktop');
  const handleSwitch = (value) => {
    setSelected(value);
    onSwitch(value);
  };
  return (
    <div className="salestorm-preview-switch">
      <Button
        icon={DesktopMajor}
        primary={selected === 'desktop'}
        onClick={() => handleSwitch('desktop')}
      >
        Desktop
      </Button>
      <Button
        icon={TabletMajor}
        primary={selected === 'tablet'}
        onClick={() => handleSwitch('tablet')}
      >
        Tablet
      </Button>
      <Button
        icon={MobileMajor}
        primary={selected === 'mobile'}
        onClick={() => handleSwitch('mobile')}
      >
        Mobile
      </Button>
    </div>
  );
};

export default CampaignPreviewSwitch;
