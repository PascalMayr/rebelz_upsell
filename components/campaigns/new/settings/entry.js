import Settings from '.';

const EntrySettings = ({ campaign, setCampaignProperty }) => {
  const changeEntry = (newEntry) => {
    setCampaignProperty({ ...campaign.targets, entry: newEntry }, 'targets');
  };
  const targetsEntry = campaign.targets.entry;
  const targetsPage = campaign.targets.page;
  let targetPageButton = 'Continue shopping';
  if (targetsPage === 'add_to_cart') {
    targetPageButton = 'Add to cart';
  } else if (targetsPage === 'checkout') {
    targetPageButton = 'Checkout';
  }
  const explanation =
    targetsEntry === 'onexit'
      ? `Customers will see the campaign popup <strong>when leaving your store</strong>. <strong>On mobile</strong>, it will also show when they switch tabs/apps and then switch back to your store.</strong>`
      : `Customers will see the campaign popup <strong>when they click the ${targetPageButton} Button.</strong>`;
  return (
    <>
      <div
        className="settings-explanation"
        dangerouslySetInnerHTML={{ __html: explanation }}
      />
      <Settings
        settings={[
          {
            id: 'onexit',
            label: 'Before customers leave the page',
            name: 'entry',
            onChange: changeEntry,
            image: {
              src: '/exit_intent.svg',
              alt: 'Exit intent',
              width: '150',
              height: '150',
            },
          },
          {
            id: 'onclick',
            label: `When customers click the ${targetPageButton} button`,
            name: 'entry',
            onChange: changeEntry,
            image: {
              src: '/click.svg',
              alt: 'Clicking',
              width: '150',
              height: '150',
            },
          },
        ]}
        value={targetsEntry}
      />
    </>
  );
};

export default EntrySettings;
