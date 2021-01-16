import api from './api';

const toggleStoreEnabled = (enabled) =>
  api.patch('/api/store/enable', { enabled });

export default toggleStoreEnabled;
