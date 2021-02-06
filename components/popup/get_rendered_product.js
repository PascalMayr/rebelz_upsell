import PlaceholderPreview from '../campaigns/new/preview/placeholder';

const getRenderedProduct = (campaign) =>
  campaign.products.selling.length > 0
    ? campaign.products.selling[0]
    : PlaceholderPreview;

export default getRenderedProduct;
