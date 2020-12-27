import api from './api';

const publishCampaign = async (html) => api.post('/api/publish-campaign', { html });

export default publishCampaign;
