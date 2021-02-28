import { Page, Layout, Link, Card, Heading } from '@shopify/polaris';

const Tips = () => {
  return (
    <Page
      title="Useful Tips & Readings"
      subtitle="Plan your funnel campaigns with a strategy."
      breadcrumbs={[{ content: 'Campaigns', url: '/' }]}
    >
      <Card>
        <Card.Section>
          <div>
            <Link url="https://shopify.com/encyclopedia/upselling" external>
              What is Upselling?
            </Link>
          </div>
          <br />
          <div>
            <Link
              url="https://www.shopify.com/blog/upselling-and-cross-selling#4"
              external
            >
              Tips to know for post-purchase upselling.
            </Link>
          </div>
          <br />
          <div>
            <Link url="https://jacobmcmillen.com/upselling/" external>
              Why Upselling at all?
            </Link>
          </div>
          <br />
          <div>
            <Link url="https://www.groovehq.com/support/upsells" external>
              Help your customers win.
            </Link>
          </div>
          <br />
          <div>
            <Link url="https://neilpatel.com/blog/the-art-of-ecommerce-upselling/" external>
              The Art of E-commerce Upselling.
            </Link>
          </div>
        </Card.Section>
      </Card>
      <br />
      <Heading>
        Our tips to plan successfull upsell and cross sell funnel campaigns:
      </Heading>
      <br />
      <Layout>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="Be tactful.">
              Harassing your customers with an offer on every page will hinder
              your sales, not help them. To avoid upsetting your customers with
              irrelevant offers, you should ensure that you’re promoting the
              right items at the right time. To get it right, market commodities
              that are compatible with what the customer is shopping.
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="Make Sure Products are Highly Relevant.">
              For your Upselling and Cross-selling tactics to deliver positive
              results, the recommended products must sync well with the product
              the user is purchasing. If they are not relevant, there would not
              be any added or expensive purchase. Instead, you will be more
              likely to turn off the customer. Our 'AI' option offers you the
              ability to use the{' '}
              <strong>
                <Link
                  external
                  url="https://shopify.dev/docs/themes/ajax-api/reference/product-recommendations"
                >
                  Shopifies Product Recommendations API
                </Link>
              </strong>
              .
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="Listen Actively to What the Customer Is Saying.">
              All selling starts with listening. Offers will only hit the target
              when they derive from your ability to relate to the customer’s
              situation. Make sure to read your customers reviews and try to
              solve their problems first. You can try out <strong><Link external url="https://partnerdrift.com/referralapps/evm-testimonials-showcase?ref=PASCA15053&partner=eNortjK2UirIKFCyBlwwECsC4g..">Product Reviews & Testimonials</Link></strong>
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
      <br />
      <Layout>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="K.I.S.S">
              <strong>K</strong>eep <strong>I</strong>t <strong>S</strong>imple{' '}
              <strong>S</strong>tupid. Although you may have some priority items
              that you really want to sell as a business, you still need to be
              realistic in your targets. If you go too far, you may find that
              you start to get on your customers’ nerves. This can turn your
              customer away from your brand for the short, or even longer term.
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="focus everything on how the customer wins.">
              You need to make sure, that customers are getting the best value
              for their money. They are trusting you already just show them that
              you can also be trusted when offering special offers.
            </Card.Section>
          </Card>
        </Layout.Section>
        <Layout.Section oneThird>
          <Card>
            <Card.Section title="Upselling at the checkouts.">
              The checkout process is a great time to suggest upgraded or
              related products. Customers who are in the process of checking out
              are already (hopefully!) mid-purchase, so it’s the ideal time to
              catch their interest. You can use our{' '}
              <strong>Before checkout</strong> option to achieve an upsell or
              cross sell before checkout even starts.
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Tips;
