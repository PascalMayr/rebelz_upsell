import Settings from '.';

const TriggerSettings = ({ campaign, setCampaignProperty }) => {
  const changeTrigger = (newTrigger) => {
    let checkoutActionText = 'Continue shopping';
    let interruptEvents = false;
    if (newTrigger === 'add_to_cart') {
      checkoutActionText = 'Go to cart';
    }
    if (newTrigger === 'checkout') {
      checkoutActionText = 'Go to checkout';
      interruptEvents = true;
    }
    setCampaignProperty({ ...campaign.targets, page: newTrigger }, 'targets', {
      texts: { ...campaign.texts, checkoutAction: checkoutActionText },
      options: { ...campaign.options, interruptEvents },
    });
  };
  const targetsPage = campaign.targets.page;
  const explanation = `Customers will see this campaign <strong>${
    targetsPage === 'add_to_cart'
      ? 'on the Product page'
      : targetsPage === 'checkout'
      ? 'on the Cart page'
      : 'after purchasing on the Thank you page'
  }</strong> on the specified target products or collections. <strong>If no products or collections are set than the campaign will be shown for every product in your store.</strong>`;
  return (
    <>
      <div
        className="salestorm-settings-explanation"
        dangerouslySetInnerHTML={{ __html: explanation }}
      />
      <Settings
        settings={[
          {
            id: 'add_to_cart',
            label: 'On the product page',
            name: 'triggers',
            onChange: changeTrigger,
            image: {
              src: '/add_to_cart.svg',
              alt: 'Product page',
              width: '150',
              height: '150',
            },
          },
          {
            id: 'checkout',
            label: 'Before checkout',
            name: 'triggers',
            onChange: changeTrigger,
            image: {
              src: '/before_checkout.svg',
              alt: 'Before checkout',
              width: '150',
              height: '150',
            },
          },
          {
            id: 'thank_you',
            label: 'On the Thank you page',
            name: 'triggers',
            onChange: changeTrigger,
            image: {
              src: '/thank_you.svg',
              alt: 'Thank you',
              width: '150',
              height: '150',
            },
          },
        ]}
        value={campaign.targets.page}
      />
    </>
  );
};

export default TriggerSettings;
