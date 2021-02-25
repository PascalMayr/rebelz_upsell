import api from './api';

const getCampaigns = () => api.post('/api/campaigns');

export default getCampaigns;
