import React from 'react';

const DescriptionProduct = ({ descriptionHtml, ...props }) => (
  <div
    id="salestorm-product-description"
    class="d-none"
    dangerouslySetInnerHTML={{
      __html: descriptionHtml,
    }}
    {...props}
  />
);

export default DescriptionProduct;
