import { Page, Layout, Button } from '@shopify/polaris';
import SalestormPricingCard from '../components/salestorm_pricing_card';
import '../styles/pricing.css';

const Pricing = () => {
  return(
  <Page
      title="Plans & Pricing"
      subtitle="Choose the best plan for your needs"
      breadcrumbs={[{content: 'Campaigns', url: '/'}]}
  >
    <div className='pricing'>
      <Layout>
        <Layout.Section oneThird>
          <SalestormPricingCard
            title='FREE Plan'
            subtitle='$0.00 / month'
            list={[
              'Unlimited Impressions',
              '2 Active Announcements',
              'Click Action',
              'Choose different positions',
              'Show Bar on Specific Pages',
              'Custom Background Images',
              'Customize Font & Styles'
            ]}
            button={<Button primary disabled>Your current plan</Button>}
          />
        </Layout.Section>
        <Layout.Section oneThird>
          <SalestormPricingCard
            title='PRO Plan'
            subtitle='$4.99 / month'
            list={[
              'Everything from FREE plan',
              '20 Active Announcements',
              'Rotating Messages',
              'Low in stock progress bar',
              'Countdown Timers',
              'Page Targeting'
            ]}
            button={<Button primary>Start 7 days FREE Trial</Button>}
          />
        </Layout.Section>
        <Layout.Section oneThird>
          <SalestormPricingCard
            title='BUSINESS Plan'
            subtitle='$7.99 / month'
            list={[
              'Everything in FREE & PRO plan',
              'Unlimited Active Bars',
              'Geotargeting',
              'Device Targeting'
            ]}
            button={<Button primary>Start 7 days FREE Trial</Button>}
          />
        </Layout.Section>
      </Layout>
    </div>
  </Page>
  )
}

export default Pricing