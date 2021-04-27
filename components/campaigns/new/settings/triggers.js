import Settings from '.';

const TriggerSettings = ({ campaign, setCampaignProperty }) => {
  const changeTrigger = (newTrigger) => {
    let checkoutActionText = '<a href="/" style="text-decoration: none; color: inherit;">Continue shopping</a>';
    let interruptEvents = false;
    if (newTrigger === 'add_to_cart') {
      checkoutActionText = '<a href="/cart" style="text-decoration: none; color: inherit;">Go to cart</a>';
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
  let targetsPageText = 'after purchasing on the Thank you page';
  if (targetsPage === 'add_to_cart') {
    targetsPageText = 'on the Product page';
  } else if (targetsPage === 'checkout') {
    targetsPageText = 'on the Cart page';
  }
  const explanation = `Customers will see this campaign <strong>${targetsPageText}</strong> on the specified target products or collections. If you haven't selected products or collections than the campaign will be shown for every product in your store.${
    targetsPage === 'thank_you'
      ? ''
      : '<strong> To create Upselling Campaigns you need to specify Target Products.</strong>'
  }`;
  return (
    <>
      <div
        className="salestorm-settings-explanation"
        dangerouslySetInnerHTML={{ __html: explanation }}
      />
      <Settings
        settings={[
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
