import api from './api';

const saveCampaign = (props, global) =>
  api.post(`/api/save-campaign${global ? '?global=true' : ''}`, props);

export default saveCampaign;
