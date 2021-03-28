import React, { useEffect } from 'react';

import Popup from '..';

const PreviewPopup = ({ campaign, preview }) => {
  const onStyleChange = (styles) => {
    const popup = document.querySelector(`#salestorm-campaign-${campaign.id}`);
    const shadow = popup && popup.shadowRoot;
    if (shadow) {
      const shadowStyles = shadow.querySelector('#salestorm-popup-styles');
      shadowStyles.innerHTML = styles;
    }
  };

  useEffect(() => {
    try {
      // eslint-disable-next-line no-eval
      eval(campaign.customJS);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [campaign.customJS]);

  return (
    <Popup
      campaign={campaign}
      preview={preview}
      onStyleChange={onStyleChange}
    />
  );
};

export default PreviewPopup;
