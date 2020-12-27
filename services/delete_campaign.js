import api from './api';

const deleteCampaign = async (id) => api.delete(`/api/delete-campaign/${id}`);

export default deleteCampaign;
