import axios from 'axios';

const deleteCampaign = async (enabled) => axios.patch('/api/store/enable', { enabled });

export default deleteCampaign;
