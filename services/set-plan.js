import api from './api';

const setPlan = (plan) => api.patch('/api/plan', { plan });

export default setPlan;
