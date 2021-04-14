import db from '../../server/db';

import New from './new';

export async function getServerSideProps(context) {
  const campaign = await db.query('SELECT * FROM campaigns WHERE id = $1', [
    context.params.id,
  ]);
  return {
    props: JSON.parse(
      JSON.stringify({
        campaign: campaign.rows[0],
      })
    ),
  };
}

const Edit = ({ campaign }) => {
  return <New campaign={campaign} />;
};

export default Edit;
