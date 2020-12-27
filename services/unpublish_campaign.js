import api from './api';

const unpublishCampaign = () => api.delete('/api/unpublish-campaign');

export default unpublishCampaign;
