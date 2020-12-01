import { Page,
  DataTable,
  Button
} from "@shopify/polaris";
import {
  CapitalMajor,
  EditMajor
} from '@shopify/polaris-icons';
import Image from 'next/image';
import '../styles/index_page.css';

const Index = () => {
  return (
  <Page
    fullWidth
    title="Sales Boost Toolbox"
    subtitle="All campaigns"
    primaryAction={{content: 'New Campaign', disabled: false }}
    secondaryActions={[{content: 'Free plan', disabled: true, icon: CapitalMajor}]}
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
      rows={
        /*[
          ['Christmas', 'Timer', 'Product Page over the Product', 'active', '11.02.2021 17:30', '13.02.2021 17:30', <Button icon={EditMajor} />],
          ['Easter', 'Timer', 'Product Page over the Product', 'inactive', '11.02.2021 17:30', '13.02.2021 17:30', <Button icon={EditMajor} />]
        ]*/[]}
    />
    <div id="no-campaigns-image">
      <Image src='/imagination.svg' alt="me" width="250" height="250" />
      You have no campaigns yet.
    </div>
  </Page>
  )
};

export default Index;
