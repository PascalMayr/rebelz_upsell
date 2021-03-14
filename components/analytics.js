import { Card, Layout } from '@shopify/polaris';

const Analytics = () => (
  <div className="salestorm-campaigns-analytics">
    <Card>
      <Card.Section title="Period overview">

      </Card.Section>
    </Card>
    <br />
    <Layout>
      <Layout.Section oneHalf>
        <Card>
          <Card.Section title="Sales Funnels" />
        </Card>
      </Layout.Section>
      <Layout.Section oneHalf>
        <Card>
          <Card.Section title="Conversions" />
        </Card>
      </Layout.Section>
    </Layout>
  </div>
);

export default Analytics;
