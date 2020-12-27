import axios from 'axios';

const api = axios.create({
  timeout: 8000, // https://ux.stackexchange.com/a/56747
});

export default api;
