import { Checkbox, TextField } from '@shopify/polaris';
import '../../../styles/components/campaigns/new/options.css';

const Options = ({ campaign, setCampaignProperty }) => {
  const options = campaign.options;
  const {
    multiCurrencySupport,
    quantityEditable,
    linkToProduct,
    hideOutOfStockProducts,
    showCountdown,
    countdownTime
  } = options;
  return (
    <div className="salestorm-options">
      <div>
        <Checkbox
          checked={linkToProduct}
          onChange={(value) =>
            setCampaignProperty({ ...options, linkToProduct: value }, 'options')
          }
          label={<span><strong>Link</strong> to the product.</span>}
        />
        <Checkbox
          checked={hideOutOfStockProducts}
          onChange={(value) =>
            setCampaignProperty(
              { ...options, hideOutOfStockProducts: value },
              'options'
            )
          }
          label={<span><strong>Hide</strong> out of stock products.</span>}
        />
      </div>
      <div>
        <Checkbox
          checked={multiCurrencySupport}
          onChange={(value) =>
            setCampaignProperty(
              { ...options, multiCurrencySupport: value },
              'options'
            )
          }
          label={<span><strong>Enable</strong> Multi Currency Support.</span>}
        />
        <Checkbox
          checked={quantityEditable}
          onChange={(value) =>
            setCampaignProperty(
              { ...options, quantityEditable: value },
              'options'
            )
          }
          label={<span><strong>Enable</strong> clients set offer quantities.</span>}
        />
      </div>
      <div>
        <Checkbox
          checked={showCountdown}
          onChange={(value) =>
            setCampaignProperty({ ...options, showCountdown: value }, 'options')
          }
          label={<span><strong>Show</strong> a countdown until end/next offer.</span>}
        />
        <TextField
          type="time"
          disabled={!showCountdown}
          value={countdownTime}
          onChange={(value) =>
            setCampaignProperty({ ...options, countdownTime: value }, 'options')
          }
          suffix="Minutes"
        />
      </div>
    </div>
  );
};

export default Options;