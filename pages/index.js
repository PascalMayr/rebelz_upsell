import { Page,
  DataTable,
  Button
} from "@shopify/polaris";
import {
  CapitalMajor
} from '@shopify/polaris-icons';
import Image from 'next/image';
import '../styles/index_page.css';
import Link from 'next/Link';

const Index = ({rows = []}) => {
  return (
  <Page
    fullWidth
    title="All Campaigns"
    subtitle="Create new campaigns and boost your sales."
    primaryAction={
      <Link href='/campaigns'>
        <Button primary><span className='salestorm-add-campaign'>+</span> New Campaign</Button>
      </Link>
    }
    secondaryActions={[
      {content: 'Upgrade', disabled: false, url: '/pricing'},
      {content: 'Free plan', disabled: true, icon: CapitalMajor},
    ]}
  >
    <DataTable
      columnContentTypes={[
        'text',
        'text',
        'text',
        'text',
        'text',
        'text'
      ]}
      headings={[
        'Campaign',
        'Type',
        'Position',
        'Status',
        'Starts',
        'Ends',
        ''
      ]}
      sortable={[true, true, true, true, true, true, false]}
      rows={rows}
    />
    {
      rows.length === 0 &&
      <div id="no-campaigns-image">
        <Image src='/imagination.svg' alt="me" width="250" height="250" />
        You have no campaigns yet.
      </div>
    }
  </Page>
  )
};

export default Index;
