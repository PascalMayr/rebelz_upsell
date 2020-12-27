import api from './api';

const publishCampaign = (html) => api.post('/api/publish-campaign', { html });

export default publishCampaign;
