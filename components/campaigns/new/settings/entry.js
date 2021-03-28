import Settings from '.';

const EntrySettings = ({ campaign, setCampaignProperty }) => {
  const changeEntry = (newEntry) => {
    setCampaignProperty({ ...campaign.targets, entry: newEntry }, 'targets');
  };
  const targetsEntry = campaign.targets.entry;
  const targetsPage = campaign.targets.page;
  const targetPageButton =
    targetsPage === 'add_to_cart'
      ? 'Add to cart'
      : targetsPage === 'checkout'
      ? 'Checkout'
      : 'Continue shopping';
  const explanation =
    targetsEntry === 'onexit'
      ? `Customers will see the campaign popup <strong>when leaving your store on desktop and after 3 seconds on mobile.</strong>`
      : `Customers will see the campaign popup <strong>when clicking the ${targetPageButton} Button.</strong>`;
  return (
    <>
      <div
        className="salestorm-settings-explanation"
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
            label: `When customers click the ${targetPageButton} Button`,
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
