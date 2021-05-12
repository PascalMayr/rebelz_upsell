import Settings from '..';
import DefaultStateNew from '../../defaultState';

import DetailsStrategy from './details';

const StrategySettings = ({ campaign, setCampaignProperty }) => {
  const strategy = campaign.strategy;
  const mode = campaign.strategy.mode;
  const texts = {
    discount: DefaultStateNew.texts,
    free_shipping: {
      ...DefaultStateNew.texts,
      title: 'Deal unlocked! Accept this offer and get free shipping.',
      subtitle: '<center><strong>{{ProductPrice}}</strong></center>',
      addToCartAction: 'ADD TO CART',
      addToCartUnavailable: 'Unavailable',
      seeProductDetailsAction: 'See product details',
      dismissAction: 'No thanks',
      checkoutAction: '<a href="/cart" style="text-decoration: none; color: inherit;">Go to cart</a>',
      countdown: 'Offer expires in {{Countdown}} minutes',
    },
    gift: {
      ...DefaultStateNew.texts,
      title:
        'Thanks for trusting us! You will get this additional item for free.',
      subtitle: '',
      addToCartAction: 'ADD TO CART',
      addToCartUnavailable: 'Unavailable',
      seeProductDetailsAction: 'See product details',
      dismissAction: 'No thanks',
      checkoutAction: '<a href="/cart" style="text-decoration: none; color: inherit;">Go to cart</a>',
      countdown: 'Offer expires in {{Countdown}} minutes',
    },
  };
  const changeStrategyMode = (newStrategyMode) => {
    const newStrategy = { ...strategy, mode: newStrategyMode };
    const sellingProducts = campaign.selling.products.map((product) => ({
      ...product,
      strategy: newStrategy,
    }));
    setCampaignProperty(newStrategy, 'strategy', {
      texts: texts[newStrategyMode],
      selling: { ...campaign.selling, products: sellingProducts },
    });
  };
  const targetsPage = campaign.targets.page;
  let explanation =
    'Offer a gift to your customers to improve your Brand Recognition.';
  if (mode === 'discount') {
    explanation =
      'Set a <strong>fix</strong> or <strong>percentage</strong> discount.';
  } else if (mode === 'free_shipping') {
    explanation = `Offer Free Shipping <strong>on the whole order.</strong> The product offered will be <strong>${
      strategy.sellType === 'upsell' ? 'replaced in' : 'added to'
    } the customers cart.</strong>`;
  }
  let settingsExplanation = '';
  if (mode !== 'gift') {
    settingsExplanation = `Upselling means <strong>replacing</strong> the offered product with <strong>target products</strong> while Cross Selling means <strong>adding</strong> products to your customers cart. ${
      targetsPage === 'thank_you'
        ? ''
        : '<strong>To create Upselling Campaigns you need to specify Target Products in Step 1</strong>'
    }`;
  }
  return (
    <>
      <div
        className="salestorm-settings-explanation"
        dangerouslySetInnerHTML={{
          __html: `${explanation} Leave the min/max order value blank or zero if you don't want to set it. ${settingsExplanation}`,
        }}
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
          targets={campaign.targets}
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
