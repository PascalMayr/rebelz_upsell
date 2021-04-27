import axios from 'axios';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { useAppBridge } from '@shopify/app-bridge-react';

export default function useApi() {
  // https://ux.stackexchange.com/a/56747
  const api = axios.create({
    timeout: 8000,
  });
  const app = useAppBridge();
  api.interceptors.request.use(async (config) => {
    const sessionToken = await getSessionToken(app);
    config.headers.Authorization = `Bearer ${sessionToken}`;
    return config;
  });

  return api;
}
