import PlaceholderPreview from '../preview/placeholder';

const getRenderedProductUtil = (campaign) => {
  let currentOffer = 0;
  if (typeof document !== 'undefined') {
    const popup = document.querySelector(`#salestorm-campaign-${campaign.id}`);
    currentOffer = parseInt(popup.getAttribute('currentoffer'), 10);
  }
  const currentProduct =
    campaign.selling.products.length > 0
      ? campaign.selling.products[currentOffer]
      : PlaceholderPreview(campaign.strategy);
  return currentProduct;
};

export default getRenderedProductUtil;
