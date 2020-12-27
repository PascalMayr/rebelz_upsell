import axios from 'axios';

// https://ux.stackexchange.com/a/56747
const api = axios.create({
  timeout: 8000,
});

export default api;
