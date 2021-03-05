import { Card, Layout } from '@shopify/polaris';

const Analytics = () => (
  <div className="salestorm-campaigns-analytics">
    <Layout>
      <Layout.Section>
        <Card>
          <Card.Section title="Revenue growth" />
        </Card>
      </Layout.Section>
      <br />
      <Layout.Section>
        <Card>
          <Card.Section title="Top converting funnels" />
        </Card>
      </Layout.Section>
      <br />
      <Layout.Section>
        <Card>
          <Card.Section title="Funnel views" />
        </Card>
      </Layout.Section>
    </Layout>
  </div>
);

export default Analytics;
