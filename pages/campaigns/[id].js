import New from './new';
import db from '../../server/db';

export async function getServerSideProps(context) {
  const data = await db.query('SELECT * FROM campaigns WHERE id = $1', [context.params.id]);
  return {
    props: {
      campaign: data.rows[0]
    }
  }
}

const Edit = ({campaign}) => {
  return <New campaign={campaign} />
}

export default Edit
