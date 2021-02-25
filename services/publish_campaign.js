import api from './api';

const publishCampaign = (id) => api.post(`/api/publish-campaign/${id}`);

export default publishCampaign;
