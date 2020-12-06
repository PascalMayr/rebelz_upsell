import axios from 'axios'

const unpublishCampaign = async () => {
  return axios.delete('/api/unpublish-campaign', {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default unpublishCampaign;
