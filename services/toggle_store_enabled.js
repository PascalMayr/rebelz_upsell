import api from './api';

const deleteCampaign = (enabled) => api.patch('/api/store/enable', { enabled });

export default deleteCampaign;
