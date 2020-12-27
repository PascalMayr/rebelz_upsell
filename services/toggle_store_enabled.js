import api from './api';

const deleteCampaign = async (enabled) => api.patch('/api/store/enable', { enabled });

export default deleteCampaign;
