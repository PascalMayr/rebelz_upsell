import React from 'react';
import '../../styles/components_campaign_product.css';

const CampaignPreviewProduct = ({data, productKey, campaign}) => {
  const { priceRange, images, title, descriptionHtml } = data.product;
  const { transformedSrc, altText } = images.edges.length > 0 && images.edges[0].node;
  const alt = altText ? altText : `${productKey}-image`;
  return (
    <div id='salestorm-product'>
      <div id='salestorm-product-image'>
        {
          transformedSrc && <img src={transformedSrc} alt={alt} width={parseInt(campaign.styles.width) / 2.5 } />
        }
      </div>
      <div id='salestorm-product-info'>
        <h1 id='salestorm-product-title'>{title}</h1>
        <br />
        <div id='salestorm-product-description' dangerouslySetInnerHTML={{__html: descriptionHtml}} />
      </div>


    </div>
  )
}

export default CampaignPreviewProduct