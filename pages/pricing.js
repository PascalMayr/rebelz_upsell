import { Page, Layout, Button } from '@shopify/polaris';
import SalestormPricingCard from '../components/salestorm_pricing_card';
import '../styles/pages_pricing.css';

const Pricing = () => {
  return (
    <Page
      title="Plans & Pricing"
      subtitle="Choose the best plan for your needs"
      breadcrumbs={[{ content: 'Campaigns', url: '/' }]}
    >
      <div className='plans-container'>
        <Layout>
          <Layout.Section oneThird>
            <SalestormPricingCard
              title="FREE Plan"
              subtitle="$0.00 / month"
              list={[
                'Unlimited Impressions',
                '2 Active Campaigns',
                'Popup styling',
                '100% Responsive',
                'No Branding',
                'Custom Background Images',
                'Customize Font & Styles',
              ]}
              button={
                <Button primary disabled>
                  Your current plan
                </Button>
              }
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <SalestormPricingCard
              title="PRO Plan"
              subtitle="$4.99 / month"
              list={[
                'Everything from FREE plan',
                '20 Active Campaigns',
                'Rotating Products',
                'Low in stock progress bar',
                'Countdown Timers'
              ]}
              button={<Button primary>Start 14 days FREE Trial</Button>}
            />
          </Layout.Section>
          <Layout.Section oneThird>
            <SalestormPricingCard
              title="BUSINESS Plan"
              subtitle="$7.99 / month"
              list={[
                'Everything in FREE & PRO plan',
                'Unlimited Campaigns',
                'Geotargeting',
                'Device Targeting',
              ]}
              button={<Button primary>Start 14 days FREE Trial</Button>}
            />
          </Layout.Section>
        </Layout>
      </div>
    </Page>
  );
};

export default Pricing;
