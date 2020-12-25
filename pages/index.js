import { Page, DataTable, Button, Badge } from '@shopify/polaris';
import { CircleTickOutlineMinor } from '@shopify/polaris-icons';
import Image from 'next/image';
import '../styles/pages_index.css';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';
import db from '../server/db';

const Index = ({ campaigns, totalRevenue = '$0', appName = 'Salestorm Upsell', plan = 'free_plan' }) => {
  const [enabled, setEnabled] = useState(false);
  const handleEnableDisable = useCallback(() => setEnabled((active) => !active), []);
  return (
    <Page
      fullWidth
      title="All Campaigns"
      subtitle="Create new campaigns and boost your sales."
      titleMetadata={<Badge status={plan === 'free_plan' ? 'new' : 'success'} progress={plan === 'free_plan' ? 'incomplete' : 'complete'}>{plan.replace('_', ' ').toUpperCase()}</Badge>}
      primaryAction={
        <NextLink href="/campaigns">
          <Button primary>
            <span className="salestorm-add-campaign">+</span> New Campaign
          </Button>
        </NextLink>
      }
      secondaryActions={[
        { content: 'Upgrade', disabled: false, url: '/pricing', id: 'pricing-button' }
      ]}
    >
      <div className='enabled-satus-container'>
        <h2 id='total-revenue'>Total Revenue: {totalRevenue}</h2>
        <div>
          <span className='enabled-status'>{appName} is <strong style={{color: enabled ? '#50b83c' : 'red'}}>{ enabled ? 'enabled' : 'disabled'}</strong></span>
          <Button
            onClick={handleEnableDisable}
            primary={!enabled}
          >
            {
              enabled ? 'Disable' : 'Enable'
            }
          </Button>
        </div>
      </div>
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
        rows={campaigns}
      />
      {campaigns.length === 0 && (
        <div className="no-campaigns-container">
          <div className='no-campaigns-image-section'>
            <Image src="/imagination.svg" alt="me" width="250" height="250" />
            <p>Follow the steps below to get started.</p>
            <br />
          </div>
          <div className='no-campaigns-stepper-section'>
            <div className='stepper-container'>
              <div className='stepper stepper-checked'>
                <CircleTickOutlineMinor alt='stepper-checkmark' className='stepper-checkmark stepper-checked' />
                <p>1. Install the app</p>
              </div>
              <div className={`stepper ${enabled ? 'stepper-checked' : ''}`}>
                <CircleTickOutlineMinor alt='stepper-checkmark' className={`stepper-checkmark ${enabled ? 'stepper-checked' : ''}`} />
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

export async function getServerSideProps(ctx) {
  const data = await db.query('SELECT * FROM campaigns WHERE domain = $1', [ctx.req.cookies.shopOrigin]);
  return { props: { campaigns: data.rows } }
}

export default Index;
