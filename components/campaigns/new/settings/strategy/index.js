import Settings from '..';
import DefaultStateNew from '../../../../../pages/campaigns/new/defaultState';

import DetailsStrategy from './details';

import '../../../../../styles/components/campaigns/new/settings/strategy/index.css';

const StrategySettings = ({ campaign, setCampaignProperty }) => {
  const strategy = campaign.strategy;
  const mode = campaign.strategy.mode;
  const texts = {
    discount: DefaultStateNew.texts,
    free_shipping: {
      ...DefaultStateNew.texts,
      title: 'Deal unlocked! Accept this offer and get free shipping.',
      subtitle: '<center><strong>{{ProductPrice}}</strong></center>',
      addToCartAction: '🎁  &nbsp; CLAIM OFFER !',
      addToCartUnavailable: 'Unavailable',
      seeProductDetailsAction: 'See product details',
      dismissAction: 'No thanks',
      checkoutAction: 'Go to cart',
      countdown: 'Offer expires in {{Countdown}} minutes',
    },
    gift: {
      ...DefaultStateNew.texts,
      title:
        'Thanks for trusting us! You will get this additional item for free.',
      subtitle: '',
      addToCartAction: '🎁  &nbsp; CLAIM OFFER !',
      addToCartUnavailable: 'Unavailable',
      seeProductDetailsAction: 'See product details',
      dismissAction: 'No thanks',
      checkoutAction: 'Go to cart',
      countdown: 'Offer expires in {{Countdown}} minutes',
    },
  };
  const changeStrategyMode = (newStrategyMode) => {
    setCampaignProperty({ ...strategy, mode: newStrategyMode }, 'strategy', {
      texts: texts[newStrategyMode],
    });
  };
  const explanation =
    mode === 'discount'
      ? 'Set a fix or percentage discount. <strong>You can adjust this discount for every product at the card below.</strong>'
      : mode === 'free_shipping'
      ? `Offer free shipping <strong>on the whole order.</strong> The product offered will be <strong>${
          strategy.sellType === 'upsell' ? 'replaced in' : 'added to'
        } the customers cart.</strong>`
      : 'Offer a gift to your customers to improve your brand recognition value.';
  return (
    <>
      <div
        className="salestorm-settings-explanation"
        dangerouslySetInnerHTML={{ __html: explanation + ' Leave the min/max order value blank or zero if you do not want to set it. Remember: Upselling means replacing the offered product with a target product in your customers cart while cross selling means adding products to your customers cart.' }}
      />
      <Settings
        settings={[
          {
            id: 'discount',
            label: 'Offer a Discount',
            name: 'strategy',
            onChange: changeStrategyMode,
            image: {
              src: '/discount.svg',
              alt: 'Discount',
              width: '150',
              height: '150',
            },
          },
          {
            id: 'free_shipping',
            label: 'Offer Free Shipping',
            name: 'strategy',
            onChange: changeStrategyMode,
            image: {
              src: '/free_shipping.svg',
              alt: 'Free shipping',
              width: '150',
              height: '150',
            },
          },
          {
            id: 'gift',
            label: 'Offer a Gift',
            name: 'strategy',
            onChange: changeStrategyMode,
            image: {
              src: '/gift.svg',
              alt: 'Gift',
              width: '150',
              height: '150',
            },
          },
        ]}
        value={strategy.mode}
      />
      <br />
      <br />
      <div className="salestorm-general-strategy-settings">
        <DetailsStrategy
          strategy={campaign.strategy}
          onChange={(newDiscountStrategy) => {
            const products = campaign.selling.products.map((product) => {
              const helper = product;
              helper.strategy = newDiscountStrategy;
              return helper;
            });
            setCampaignProperty(
              {
                ...strategy,
                ...newDiscountStrategy,
              },
              'strategy',
              {
                selling: {
                  ...campaign.selling,
                  products,
                },
              }
            );
          }}
        />
      </div>
    </>
  );
};

export default StrategySettings;
