const publishCampaign = async (campaign) => {
  return fetch('/api/publish-campaign', {
    method: 'POST',
    body: JSON.stringify(campaign),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
};

export default publishCampaign;
