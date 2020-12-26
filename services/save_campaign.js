import axios from 'axios';

const saveCampaign = async (props) => {
  return axios.post('/api/save-campaign', props);
};

export default saveCampaign;
