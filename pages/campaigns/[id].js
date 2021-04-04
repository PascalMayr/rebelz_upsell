import db from '../../server/db';

import New from './new';

export async function getServerSideProps(context) {
  const data = await db.query('SELECT * FROM campaigns WHERE id = $1', [
    context.params.id,
  ]);
  const campaign = data.rows[0];
  return {
    props: {
      campaign: {
        ...campaign,
        ...{
          created: campaign.created
            ? campaign.created.toISOString()
            : campaign.created,
          updated: campaign.updated
            ? campaign.updated.toISOString()
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
