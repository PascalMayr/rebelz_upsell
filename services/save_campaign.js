import api from './api';

const saveCampaign = async (props) => api.post('/api/save-campaign', props);

export default saveCampaign;
