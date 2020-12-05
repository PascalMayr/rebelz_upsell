const publishCampaign = async () => {
  return fetch("/api/publish-campaign", {
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => data.json());
};

export default publishCampaign;
