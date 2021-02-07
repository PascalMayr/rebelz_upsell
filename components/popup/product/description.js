import React from 'react';

const DescriptionProduct = ({ descriptionHtml, ...props }) => (
  <div
    id="salestorm-product-description"
    dangerouslySetInnerHTML={{
      __html: descriptionHtml,
    }}
    {...props}
  />
);

export default DescriptionProduct;
