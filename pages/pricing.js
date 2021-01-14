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
                '500 monthly Funnel views',
                'Product-, Cart-, Post purchase upsell funnels',
                '100% Responsive',
                'No Branding',
                'Customize all Fonts and Styles',
                'Autopilot',
                'Analytics',
                'Premium Support'
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
              subtitle='$39.99 / month'
              list={[
              'Everything from FREE plan',
              '10.000 monthly Funnel views',
              'Premium Support'
              ]}
              button={<Button primary>Start 7 days FREE trial</Button>}
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <PricingCard
              title='BUSINESS Plan'
              subtitle='$69.99 / month'
              list={['Everything in FREE & PRO plan', '100.000 monthly Funnel views', 'Premium Support']}
              button={<Button primary>Start 7 days FREE trial</Button>}
            />
          </Layout.Section>
        </Layout>
        <br />
        <p>Cancel anytime, no strings attached.</p>
      </div>
    </Page>
  );
};

export default Pricing;
