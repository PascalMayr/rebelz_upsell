import axios from 'axios'

const publishCampaign = async (html) => {
  return axios.post('/api/publish-campaign', { html });
};

export default publishCampaign;
