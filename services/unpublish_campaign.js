import api from './api';

const unpublishCampaign = async () => api.delete('/api/unpublish-campaign');

export default unpublishCampaign;
