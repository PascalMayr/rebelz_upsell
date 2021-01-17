import { useState, useContext } from 'react';
import { Page, Layout, Button } from '@shopify/polaris';

import config from '../config';
import PricingCard from '../components/pricing_card';
import setPlan from '../services/set-plan';

import { AppContext } from './_app';
import '../styles/pages_pricing.css';

const Pricing = () => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(null);
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
                    <Button
                      primary
                      disabled={Boolean(loading)}
                      loading={loading === plan.name}
                      onClick={async () => {
                        setLoading(plan.name);
                        try {
                          const response = await setPlan(plan.name);
                          const { confirmationUrl } = response.data;
                          if (confirmationUrl) {
                            window.top.location = confirmationUrl;
                          } else {
                            context.setToast({
                              shown: true,
                              content: `Successfully canceled your subscription`,
                              isError: true,
                            });
                          }
                        } catch (e) {
                          context.setToast({
                            shown: true,
                            content: `Failed to change to ${plan.name}`,
                            isError: true,
                          });
                        } finally {
                          setLoading(null);
                        }
                      }}
                    >
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
