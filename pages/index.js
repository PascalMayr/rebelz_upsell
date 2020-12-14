import { Page, DataTable, Button } from '@shopify/polaris';
import { CapitalMajor } from '@shopify/polaris-icons';
import Image from 'next/image';
import '../styles/pages_index.css';
import NextLink from 'next/link';

const Index = ({ rows = [] }) => {
  return (
    <Page
      fullWidth
      title="All Campaigns"
      subtitle="Create new campaigns and boost your sales."
      primaryAction={
        <NextLink href="/campaigns">
          <Button primary>
            <span className="salestorm-add-campaign">+</span> New Campaign
          </Button>
        </NextLink>
      }
      secondaryActions={[
        { content: 'Upgrade', disabled: false, url: '/pricing' },
        { content: 'Free plan', disabled: true, icon: CapitalMajor },
      ]}
    >
      <DataTable
        columnContentTypes={['text', 'text', 'text', 'text', 'text', 'text']}
        headings={[
          'Campaign',
          'Active',
          'Targets',
          'Views',
          'Revenue',
          'Sales',
          'Impressions',
          'Conversion Rate',
          'Actions'
        ]}
        rows={rows}
      />
      {rows.length === 0 && (
        <div className="no-campaigns-container">
          <div className='no-campaigns-image-section'>
            <Image src="/imagination.svg" alt="me" width="250" height="250" />
            <p>Follow the steps below to get started.</p>
            <br />
          </div>
          <div className='no-camapaigns-stepper-section'>
            <div className='stepper-container'>
              <div className='stepper stepper-checked'>
                <CircleTickOutlineMinor alt='stepper-checkmark' className='stepper-checkmark stepper-checked' />
                <p>1. Install the app</p>
              </div>
              <div className='stepper'>
                <CircleTickOutlineMinor alt='stepper-checkmark' className='stepper-checkmark' />
                <p>2. Enable the app</p>
              </div>
              <div className='stepper'>
                <CircleTickOutlineMinor alt='stepper-checkmark' className='stepper-checkmark' />
                <p id='stepper-new-cammpaign-link'><NextLink href='/campaigns'>3. Create a campaign</NextLink></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Page>
  );
};

export default Index;
