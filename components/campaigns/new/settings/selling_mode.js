import { Link } from '@shopify/polaris';

import Settings from '.';

const SellingModeSetting = ({ campaign, setCampaignProperty }) => {
  const sellingMode = campaign.selling.mode;
  const changeSellingMode = (mode) => {
    setCampaignProperty({ ...campaign.selling, mode }, 'selling');
  };
  const explanation =
    sellingMode === 'auto' ? (
      <>
        By using the{' '}
        <Link
          external
          url="https://shopify.dev/docs/themes/ajax-api/reference/product-recommendations"
        >
          Product Recommendations API
        </Link>{' '}
        from Shopify we ensure <strong>just showing relevant products</strong>{' '}
        to your customers.
      </>
    ) : (
      <>
        All Products will be shown after a specific time. You can set the time
        under the <strong>Advnaced Settings, Styles and Texts</strong> found
        below.
      </>
    );
  return (
    <>
      <div className="salestorm-settings-explanation">{explanation}</div>
      <Settings
        settings={[
          {
            id: 'auto',
            label: 'Let the AI decide',
            name: 'selling',
            onChange: changeSellingMode,
            image: {
              src: '/auto_pilot.svg',
              alt: 'Discount',
              width: '150',
              height: '150',
            },
          },
          {
            id: 'manual',
            label: 'Set products manually',
            name: 'selling',
            onChange: changeSellingMode,
            image: {
              src: '/manual.svg',
              alt: 'Set products',
              width: '150',
              height: '150',
            },
          },
        ]}
        value={sellingMode}
      />
    </>
  );
};

export default SellingModeSetting;
