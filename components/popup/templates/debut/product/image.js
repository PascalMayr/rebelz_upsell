import { Icon } from '@shopify/polaris';
import { ArrowLeftMinor, ArrowRightMinor } from '@shopify/polaris-icons';

const ImageProduct = () => {
  return (
    <div id="salestorm-product-image-container">
      <div id="salestorm-product-image" />
      <div
        className="salestorm-product-image-gallery-arrow"
        id="salestorm-product-image-gallery-arrow-right"
      >
        <Icon source={ArrowRightMinor} />
      </div>
      <div
        className="salestorm-product-image-gallery-arrow"
        id="salestorm-product-image-gallery-arrow-left"
      >
        <Icon source={ArrowLeftMinor} />
      </div>
    </div>
  );
};

export default ImageProduct;
