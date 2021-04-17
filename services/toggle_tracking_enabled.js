import api from './api';

const toggleTrackingEnabled = ({ enabled }) =>
  api.patch('/api/store/tracking', { enabled });

export default toggleTrackingEnabled;
