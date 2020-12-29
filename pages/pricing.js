import { Page, Layout, Button } from '@shopify/polaris';
import PricingCard from '../components/pricing_card';
import '../styles/pages_pricing.css';

const Pricing = () => {
  return (
    <Page
      title='Plans & Pricing'
      subtitle='Choose the best plan for your needs.'
      breadcrumbs={[{ content: 'Campaigns', url: '/' }]}
    >
      <div className='plans-container'>
        <Layout>
          <Layout.Section oneThird>
            <PricingCard
              title='FREE Plan'
              subtitle='$0.00 / month'
              list={[
                'Unlimited Impressions',
                '2 Active Campaigns',
                '100% Responsive',
                'No Branding',
                'Custom Background Images',
                'Customize all Fonts and Styles',
                'Discount offers',
              ]}
              button={
                <Button primary disabled>
                  Your current plan
                </Button>
              }
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <PricingCard
              title='PRO Plan'
              subtitle='$29.99 / month'
              list={['Everything from FREE plan', 'Premium Support', '20 Active Campaigns']}
              button={<Button primary>Start 7 days FREE trial</Button>}
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <PricingCard
              title='BUSINESS Plan'
              subtitle='$49.99 / month'
              list={['Everything in FREE & PRO plan', 'Premium Support', 'Unlimited Campaigns']}
              button={<Button primary>Start 7 days FREE trial</Button>}
            />
          </Layout.Section>
        </Layout>
      </div>
    </Page>
  );
};

export default Pricing;
