import PlaceholderPreview from '../preview/placeholder';

const getRenderedProductUtil = (campaign) =>
  campaign.selling.products.length > 0
    ? campaign.selling.products[0]
    : PlaceholderPreview;

export default getRenderedProductUtil;
