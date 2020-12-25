import React from 'react';
import { Page, DataTable, Button, Badge } from '@shopify/polaris';
import { CircleTickOutlineMinor } from '@shopify/polaris-icons';
import Image from 'next/image';
import '../styles/pages_index.css';
import NextLink from 'next/link';
import { useCallback, useState } from 'react';

const Index = ({ rows = [], totalRevenue = '$0', appName = 'Salestorm Upsell', plan = 'free_plan' }) => {
  const [enabled, setEnabled] = useState(false);
  const handleEnableDisable = useCallback(() => setEnabled((active) => !active), []);
  const enabledStatus = enabled ? 'enabled' : 'disabled';
  const enabledButtonStatus = enabled ? 'Disable' : 'Enable';
  const priceStatus = plan === 'free_plan' ? 'new' : 'success';
  const priceProgress = plan === 'free_plan' ? 'incomplete' : 'complete';
  const headings = [
    'Campaign',
    'Active',
    'Targets',
    'Views',
    'Revenue',
    'Sales',
    'Impressions',
    'Conversion Rate',
    'Actions'
  ];
  const columnContentTypes = ['text', 'text', 'text', 'text', 'text', 'text'];
  return (
    <Page
      fullWidth
      title="All Campaigns"
      subtitle="Create new campaigns and boost your sales."
      titleMetadata={<Badge status={priceStatus} progress={priceProgress}>{plan.replace('_', ' ').toUpperCase()}</Badge>}
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
        <div id='enabled-status-inner-container'>
          <span className='enabled-status'>{appName} is <strong style={{color: enabled ? '#50b83c' : 'red'}}>{ enabledStatus }</strong></span>
          <Button
            onClick={handleEnableDisable}
            primary={!enabled}
          >
            {
              enabledButtonStatus
            }
          </Button>
        </div>
      </div>
      <DataTable
        columnContentTypes={columnContentTypes}
        headings={headings}
        rows={rows}
      />
      {rows.length === 0 && (
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

export default Index;
