import React from 'react';

const TitleProduct = ({ children, ...props }) => (
  <a id="salestorm-product-title" {...props}>
    {children}
  </a>
);

export default TitleProduct;
