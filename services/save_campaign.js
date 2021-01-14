import api from './api';

const saveCampaign = (props) => api.post('/api/save-campaign', props);

export default saveCampaign;
