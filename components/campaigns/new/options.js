import { Checkbox, TextField } from '@shopify/polaris';
import '../../../styles/components/campaigns/new/options.css';

const Options = ({ campaign, setCampaignProperty }) => {
  const options = campaign.options;
  const {
    multiCurrencySupport,
    quantityEditable,
    linkToProduct,
    enableOutOfStockProducts,
    showCountdown,
    countdownTime,
    showImageSlider,
  } = options;
  return (
    <>
      <div className="salestorm-options">
        <>
          <Checkbox
            checked={linkToProduct}
            onChange={(value) =>
              setCampaignProperty(
                {
                  ...options,
                  linkToProduct: value,
                  showImageSlider:
                    options.showImageSlider === true && value === true
                      ? false
                      : options.showImageSlider,
                },
                'options'
              )
            }
            label={
              <span>
                <strong>Link</strong> to the product.
              </span>
            }
          />
          <Checkbox
            checked={enableOutOfStockProducts}
            onChange={(value) =>
              setCampaignProperty(
                { ...options, enableOutOfStockProducts: value },
                'options'
              )
            }
            label={
              <span>
                <strong>Enable</strong> buying out of stock products.
              </span>
            }
          />
        </>
        <>
          <Checkbox
            checked={multiCurrencySupport}
            onChange={(value) =>
              setCampaignProperty(
                { ...options, multiCurrencySupport: value },
                'options'
              )
            }
            label={
              <span>
                <strong>Enable</strong> Multi Currency Support.
              </span>
            }
          />
          <Checkbox
            checked={quantityEditable}
            onChange={(value) =>
              setCampaignProperty(
                { ...options, quantityEditable: value },
                'options'
              )
            }
            label={
              <span>
                <strong>Enable</strong> clients set offer quantities.
              </span>
            }
          />
        </>
        <>
          <Checkbox
            checked={showCountdown}
            onChange={(value) =>
              setCampaignProperty(
                { ...options, showCountdown: value },
                'options'
              )
            }
            label={
              <span>
                <strong>Show</strong> a countdown until end/next offer.
              </span>
            }
          />
          <div className="salestorm-countodwn-time">
            <TextField
              type="number"
              disabled={!showCountdown}
              value={countdownTime.split(':')[0]}
              onChange={(value) =>
                setCampaignProperty(
                  {
                    ...options,
                    countdownTime: `${value}:${countdownTime.split(':')[1]}`,
                  },
                  'options'
                )
              }
              min={0}
              suffix="Min"
            />
            <TextField
              type="number"
              disabled={!showCountdown}
              value={countdownTime.split(':')[1]}
              onChange={(value) =>
                setCampaignProperty(
                  {
                    ...options,
                    countdownTime: `${countdownTime.split(':')[0]}:${value}`,
                  },
                  'options'
                )
              }
              min={0}
              suffix="Sec"
            />
          </div>
        </>
      </div>
      <div className="salestorm-options">
        <div>
          <Checkbox
            checked={showImageSlider}
            onChange={(value) =>
              setCampaignProperty(
                {
                  ...options,
                  showImageSlider: value,
                  linkToProduct:
                    options.linkToProduct === true && value === true
                      ? false
                      : options.linkToProduct,
                },
                'options'
              )
            }
            label={
              <span>
                <strong>Show</strong> the image slider.
              </span>
            }
          />
        </div>
      </div>
    </>
  );
};

export default Options;
