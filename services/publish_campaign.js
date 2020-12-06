const publishCampaign = async (html) => {
  return fetch('/api/publish-campaign', {
    method: 'POST',
    body: JSON.stringify({ html }),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default publishCampaign;
