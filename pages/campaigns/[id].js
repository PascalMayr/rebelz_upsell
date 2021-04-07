import db from '../../server/db';

import New from './new';

export async function getServerSideProps(context) {
  const data = await db.query('SELECT * FROM campaigns WHERE id = $1', [
    context.params.id,
  ]);
  const campaign = data.rows[0];
  const formatDate = (date) => new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long',hour12: false }).format(date)
  return {
    props: {
      campaign: {
        ...campaign,
        ...{
          created: campaign.created
            ? formatDate(campaign.created)
            : campaign.created,
          updated: campaign.updated
            ? formatDate(campaign.updated)
            : campaign.updated,
          deleted: campaign.deleted
            ? campaign.deleted.toString()
            : campaign.deleted,
        },
      },
    },
  };
}

const Edit = ({ campaign }) => {
  return <New campaign={campaign} />;
};

export default Edit;
