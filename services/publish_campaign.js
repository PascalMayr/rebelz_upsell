import api from './api';

const publishCampaign = () => api.post('/api/publish-campaign');

export default publishCampaign;
