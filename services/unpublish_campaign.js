import api from './api';

const unpublishCampaign = (id) => api.delete(`/api/unpublish-campaign/${id}`);

export default unpublishCampaign;
