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
import '../styles/pages_pricing.css';

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
    '100% Responsive',
    'No Branding',
    'Customize all Fonts and Styles',
    'Autopilot',
    'Analytics',
    'Premium Support',
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
        <Layout>
          <Layout.Section oneHalf>
            <Heading element="h1">
              Simple Pricing that grows with your business
            </Heading>
            <Heading subtitle>
              All Features included in every Plan. Always.
            </Heading>
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
              <Card.Header>
                <Heading element="h1">Choose Your Plan</Heading>
              </Card.Header>
              <Card.Section>
                <ResourceList
                  resourceName={{ singular: 'plan', plural: 'plans' }}
                  items={config.plans}
                  renderItem={(plan) => {
                    const { name, limit } = plan;
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
                          <TextStyle variation="strong">{name}</TextStyle>
                          <span>
                            <TextStyle variation="strong">
                              {new Intl.NumberFormat().format(limit)}
                            </TextStyle>
                            &nbsp;views/month
                          </span>
                          {hasButton ? (
                            <Button
                              primary
                              disabled={Boolean(loading)}
                              loading={loading === name}
                              onClick={() => onPlanSelect(name)}
                            >
                              {planLabel}
                            </Button>
                          ) : (<span>{planLabel}</span>)}
                        </Stack>
                      </ResourceItem>
                    );
                  }}
                />
              </Card.Section>
            </Card>
          </Layout.Section>
        </Layout>
        <br />
        <p>Cancel or change your plan anytime, no strings attached.</p>
      </div>
    </Page>
  );
};

export default Pricing;
