import { Checkbox } from '@shopify/polaris';
import '../../../styles/components/campaigns/new/options.css';

const Options = ({ campaign, setCampaignProperty }) => {
  const options = campaign.options;
  const {
    multiCurrencySupport,
    quantityEditable,
    linkToProduct,
    hideOutOfStockProducts,
  } = options;
  return (
    <div className="salestorm-options">
      <div oneHalf>
        <Checkbox
          checked={linkToProduct}
          onChange={(value) =>
            setCampaignProperty({ ...options, linkToProduct: value }, 'options')
          }
          label="Link to the product on Title and Image."
        />
        <Checkbox
          checked={hideOutOfStockProducts}
          onChange={(value) =>
            setCampaignProperty(
              { ...options, hideOutOfStockProducts: value },
              'options'
            )
          }
          label="Hide out of stock products."
        />
      </div>
      <div oneHalf>
        <Checkbox
          checked={multiCurrencySupport}
          onChange={(value) =>
            setCampaignProperty(
              { ...options, multiCurrencySupport: value },
              'options'
            )
          }
          label="Enable Multi Currency Support."
        />
        <Checkbox
          checked={quantityEditable}
          onChange={(value) =>
            setCampaignProperty(
              { ...options, quantityEditable: value },
              'options'
            )
          }
          label="Let the quantity be modified."
        />
      </div>
    </div>
  );
};

export default Options;
