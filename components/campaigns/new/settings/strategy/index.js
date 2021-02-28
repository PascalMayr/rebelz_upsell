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
      ? 'Set a fix/percentage discount at the card below.'
      : mode === 'free_shipping'
      ? `If the customer accepts the offer, free shipping <strong>will be applied on the whole order</strong> and the product offered will be <strong>${
          strategy.sellType === 'upsell' ? 'added' : 'replaced'
        }</strong> in the cart.`
      : 'Set a complimentary gift for your customers at the card below.';
  return (
    <>
      <div
        className="salestorm-settings-explanation"
        dangerouslySetInnerHTML={{ __html: explanation }}
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
