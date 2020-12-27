import axios from 'axios';

const deleteCampaign = async (id) => axios.delete(`/api/delete-campaign/${id}`);

export default deleteCampaign;
