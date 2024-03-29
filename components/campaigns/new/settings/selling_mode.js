import { Link } from '@shopify/polaris';

import Settings from '.';

const SellingModeSetting = ({ campaign, setCampaignProperty }) => {
  const sellingMode = campaign.selling.mode;
  const changeSellingMode = (mode) => {
    const sellingProducts = mode === 'manual' ? campaign.selling.products : [];
    setCampaignProperty(
      { ...campaign.selling, mode, products: sellingProducts },
      'selling'
    );
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
        from Shopify, we ensure <strong>just showing relevant products</strong>{' '}
        to your customers.
        <br />
        <strong>
          Note: New stores do not show any recommendations. Recommendations will
          generate in time.
        </strong>
      </>
    ) : (
      <>If you define many offers, customers can skip them individually.</>
    );
  return (
    <>
      <div className="settings-explanation">{explanation}</div>
      <Settings
        settings={[
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
        ]}
        value={sellingMode}
      />
    </>
  );
};

export default SellingModeSetting;
