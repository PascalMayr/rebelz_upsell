import api from './api';

const duplicateCampaign = (id) => api.post(`/api/duplicate-campaign/${id}`);

export default duplicateCampaign;
