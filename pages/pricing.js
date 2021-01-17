import { Page, Layout, Button } from '@shopify/polaris';

import config from '../config';
import PricingCard from '../components/pricing_card';
import '../styles/pages_pricing.css';

const Pricing = () => {
  return (
    <Page
      title="Plans & Pricing"
      subtitle="Choose the best plan for your needs."
      breadcrumbs={[{ content: 'Campaigns', url: '/' }]}
    >
      <div className="plans-container">
        <Layout>
          {config.plans.map((plan) => {
            let list = [
              `${new Intl.NumberFormat().format(
                plan.limit
              )} monthly Funnel views`,
            ];
            if (plan.name === config.planNames.free) {
              list = [
                ...list,
                ...[
                  'Product-, Cart-, Post purchase upsell funnels',
                  '100% Responsive',
                  'No Branding',
                  'Customize all Fonts and Styles',
                  'Autopilot',
                  'Analytics',
                ],
              ];
            } else {
              list.unshift('Everything from FREE Plan');
            }
            list.push('Premium Support');
            return (
              <Layout.Section oneThird key={plan.name}>
                <PricingCard
                  title={plan.name}
                  subtitle={`$${plan.amount} / month`}
                  list={list}
                  button={
                    <Button primary disabled>
                      Your current plan
                    </Button>
                  }
                />
              </Layout.Section>
            );
          })}
        </Layout>
        <br />
        <p>Cancel anytime, no strings attached.</p>
      </div>
    </Page>
  );
};

export default Pricing;
