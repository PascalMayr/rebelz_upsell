import { Page, Link, Card } from '@shopify/polaris';

const Tips = () => {
  return (
    <Page
      title="Useful Tips & Readings"
      subtitle="Plan your funnels with a strategy"
      breadcrumbs={[{ content: 'Campaigns', url: '/' }]}
    >
      <Card>
        <Card.Section>
          <div>
            <Link url="https://shopify.com/encyclopedia/upselling" external>What is Upselling?</Link>
          </div>
          <br />
          <div>
            <Link url="https://www.shopify.com/blog/upselling-and-cross-selling#5" external>Tips to know for post-purchase upselling.</Link>
          </div>
          <br />
          <div>
            <Link url="https://www.groovehq.com/support/upsells" external>Help your customers win.</Link>
          </div>
          <br />
        </Card.Section>
      </Card>
    </Page>
  )
}

export default Tips