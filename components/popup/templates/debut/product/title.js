import React from 'react';

const TitleProduct = ({ children, ...props }) => (
  <div id="salestorm-product-title" {...props}>
    {children}
  </div>
);

export default TitleProduct;
