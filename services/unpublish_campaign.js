const unpublishCampaign = async (html) => {
  return fetch('/api/unpublish-campaign', {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export default unpublishCampaign;
