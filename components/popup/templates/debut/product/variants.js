import React from 'react';
import { SelectMinor } from '@shopify/polaris-icons';
import { Icon } from '@shopify/polaris';

const VariantsProduct = ({ ...props }) => (
  <div id="salestorm-product-variants" {...props}>
    <div className="salestorm-product-select-container d-none">
      <select className="salestorm-product-select" />
      <div className="salestorm-product-select-arrow">
        <Icon source={SelectMinor} />
      </div>
    </div>
  </div>
);

export default VariantsProduct;
