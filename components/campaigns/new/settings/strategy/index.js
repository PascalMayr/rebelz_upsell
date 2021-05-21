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
      checkoutAction:
        '<a href="/cart" style="text-decoration: none; color: inherit;">Go to cart</a>',
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
      checkoutAction:
        '<a href="/cart" style="text-decoration: none; color: inherit;">Go to cart</a>',
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
  let explanation = '';
  let settingsExplanation = '';
  if (mode !== 'gift') {
    settingsExplanation = `Upselling means <strong>replacing</strong> the offered product with <strong>target products</strong>. Cross Selling means <strong>adding</strong> products to your customers cart.<br><br>`;
  }
  if (mode === 'discount') {
    explanation =
      'Set a <strong>fix</strong> or <strong>percentage</strong> discount.';
  } else if (mode === 'free_shipping') {
    explanation = `Offer free shipping <strong>on the whole order.</strong>`;
  }
  return (
    <>
      <div
        className="salestorm-settings-explanation"
        dangerouslySetInnerHTML={{
          __html: `${settingsExplanation}${explanation} Leave the min/max order value blank or zero if you don't need it.`,
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
            label: 'Offer free shipping',
            name: 'strategy',
            onChange: changeStrategyMode,
            image: {
              src: '/free_shipping.svg',
              alt: 'free shipping',
              width: '150',
              height: '150',
            },
          },
          {
            id: 'gift',
            label: 'Offer a gift',
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
