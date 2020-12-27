import api from './api';

const deleteCampaign = (id) => api.delete(`/api/delete-campaign/${id}`);

export default deleteCampaign;
