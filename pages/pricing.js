import { useState, useContext, useEffect } from 'react';
import {
  Page,
  Layout,
  Button,
  Heading,
  Card,
  List,
  ResourceList,
  ResourceItem,
  TextStyle,
  Stack,
} from '@shopify/polaris';

import config from '../config';
import setPlan from '../services/set-plan';
import db from '../server/db';

import { AppContext } from './_app';
import '../styles/pages/pricing.css';

export async function getServerSideProps(ctx) {
  const stores = await db.query('SELECT * FROM stores WHERE domain = $1', [
    ctx.req.cookies.shopOrigin,
  ]);
  return { props: { store: stores.rows[0] } };
}

const Pricing = ({ store }) => {
  const context = useContext(AppContext);
  const [activePlan, setActivePlan] = useState(store.plan_name);
  const [loading, setLoading] = useState(null);
  const activePlanName = activePlan || config.planNames.free;

  useEffect(() => {
    setActivePlan(store.plan_name);
  }, [store.plan_name]);

  const featureList = [
    'Product Upsell Funnels',
    'Cart Upsell Funnels',
    'Post-Purchase Upsell Funnels',
    'No Branding',
    'Quick Setup',
    '100% Responsive',
    'Customize all Texts, Fonts and Styles',
    'AI Autopilot Mode',
    'Analytics',
    'Multi Currency Support',
    'Premium Support',
    'Complete & Clean Uninstall',
  ];
  const onPlanSelect = async (name) => {
    setLoading(name);
    if (name === activePlanName) {
      try {
        await setPlan(name);
        context.setToast({
          shown: true,
          content: `Successfully canceled your subscription`,
          isError: false,
        });
        setActivePlan(null);
      } catch (e) {
        context.setToast({
          shown: true,
          content: `Failed to cancel your subscription`,
          isError: true,
        });
      } finally {
        setLoading(null);
      }
    } else {
      try {
        const response = await setPlan(name);
        const { confirmationUrl } = response.data;
        window.top.location = confirmationUrl;
      } catch (e) {
        context.setToast({
          shown: true,
          content: `Failed to change to ${name}`,
          isError: true,
        });
        setLoading(null);
      }
    }
  };
  return (
    <Page
      title="Plans & Pricing"
      className="salestorm-pricing"
      subtitle="Choose the best plan for your needs."
      breadcrumbs={[{ content: 'Campaigns', url: '/' }]}
    >
      <div className="plans-container">
        <Heading element="h1">
          All features included in every plan.
        </Heading>
        <Layout>
          <Layout.Section oneHalf>
            <List className="pricing-list" style={{ listStyle: 'none' }}>
              {featureList.map((listItem) => (
                <List.Item key={listItem}>
                  <span className="salestorm-pricing-card-checkmark">✓</span>
                  {listItem}
                </List.Item>
              ))}
            </List>
          </Layout.Section>
          <Layout.Section oneHalf>
            <Card>
              <Card.Section>
                <Heading element="h1">Choose your monthly plan</Heading>
                <ResourceList
                  resourceName={{ singular: 'plan', plural: 'plans' }}
                  items={config.plans}
                  renderItem={(plan) => {
                    const { name, limit, amount } = plan;
                    const isThisPlanActive = activePlanName === name;
                    const isThisTheFreePlan = config.planNames.free === name;
                    let planLabel;
                    let hasButton = true;
                    if (
                      activePlanName === config.planNames.free &&
                      isThisTheFreePlan
                    ) {
                      planLabel = 'Your Plan';
                      hasButton = false;
                    } else if (activePlanName === config.planNames.free) {
                      planLabel = 'Select Plan';
                    } else if (isThisPlanActive) {
                      planLabel = 'Cancel subscription';
                    } else if (isThisTheFreePlan) {
                      planLabel = '';
                      hasButton = false;
                    } else {
                      planLabel = 'Select Plan';
                    }

                    return (
                      <ResourceItem
                        id={name}
                        accessibilityLabel={`View details for ${name}`}
                      >
                        <Stack distribution="equalSpacing">
                          <div>
                            <TextStyle variation="strong">{name}</TextStyle>
                            <span className='salestorm-plan-views'>
                              {new Intl.NumberFormat().format(limit)}
                              &nbsp;views
                            </span>
                          </div>
                          <div>
                            {
                              new Intl.NumberFormat([], {
                                style: 'currency',
                                currency: 'USD'
                              }).format(amount)
                            } / month
                          </div>
                          {hasButton ? (
                            <Button
                              primary
                              disabled={Boolean(loading)}
                              loading={loading === name}
                              onClick={() => onPlanSelect(name)}
                            >
                              {planLabel}
                            </Button>
                          ) : (<span >{planLabel}</span>)}
                        </Stack>
                      </ResourceItem>
                    );
                  }}
                />
                <div className='salestorm-pricing-contact-us'>
                  <TextStyle>Need a bigger plan?</TextStyle>
                  <a href="mailto:support@salestorm.cc?subject=Plan%20Upgrade%20Inquiry">
                    <Button primary>Contact us</Button>
                  </a>
                </div>
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
        <br />
        <p className="salestorm-plans-note">Cancel or change your plan anytime, no strings attached.</p>
      </div>
    </Page>
  );
};

export default Pricing;
