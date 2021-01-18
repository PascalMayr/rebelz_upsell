import { useState, useContext } from 'react';
import { Page, Layout, Button } from '@shopify/polaris';

import config from '../config';
import PricingCard from '../components/pricing_card';
import setPlan from '../services/set-plan';
import db from '../server/db';

import { AppContext } from './_app';
import '../styles/pages_pricing.css';

export async function getServerSideProps(ctx) {
  const stores = await db.query('SELECT * FROM stores WHERE domain = $1', [
    ctx.req.cookies.shopOrigin,
  ]);
  return { props: { store: stores.rows[0] } };
}

const Pricing = ({ store }) => {
  const context = useContext(AppContext);
  const [loading, setLoading] = useState(null);
  const activePlanName = store.plan_name || config.planNames.free;
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
            const isThisPlanActive = activePlanName === plan.name;
            const isThisTheFreePlan = config.planNames.free === plan.name;
            let priceLabel;
            if (activePlanName === config.planNames.free) {
              priceLabel = isThisTheFreePlan ? 'Your Plan' : 'UPGRADE NOW';
            } else if (isThisPlanActive) {
              priceLabel = 'Cancel subscription';
            } else if (!isThisTheFreePlan) {
              priceLabel = 'Change Plan';
            }
            return (
              <Layout.Section oneThird key={plan.name}>
                <PricingCard
                  title={plan.name}
                  subtitle={`$${plan.amount} / month`}
                  list={list}
                  button={
                    <Button
                      primary
                      disabled={Boolean(loading) || isThisPlanActive}
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
                      {priceLabel}
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
