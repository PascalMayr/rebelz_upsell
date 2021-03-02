import React from 'react';

import getAnimationClassUtil from './utils/get_animation_class';
import getRenderedProductUtil from './utils/get_rendered_product';
import TemplateLoader from './templates';

const Popup = ({ campaign, preview, onStyleChange }) => (
  <salestorm-popup
    product={JSON.stringify(getRenderedProductUtil(campaign))}
    texts={JSON.stringify(campaign.texts)}
    animation={getAnimationClassUtil(campaign.styles.animation)}
    offers={campaign.selling.products.length}
    currentoffer={0}
    preview={preview}
    id={`salestorm-campaign-${campaign.id}`}
    {...campaign.options}
  >
    <TemplateLoader
      campaign={campaign}
      preview={preview}
      onStyleChange={onStyleChange}
    />
  </salestorm-popup>
);

export default Popup;
