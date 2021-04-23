import axios from 'axios';
import { getSessionToken } from '@shopify/app-bridge-utils';
import { Context as ShopifyAppContext } from '@shopify/app-bridge-react';
import { useContext } from 'react';

export default function useApi() {
  // https://ux.stackexchange.com/a/56747
  const api = axios.create({
    timeout: 8000,
  });
  const app = useContext(ShopifyAppContext);
  api.interceptors.request.use(async (config) => {
    const sessionToken = await getSessionToken(app);
    config.headers.Authorization = `Bearer ${sessionToken}`;
    return config;
  });

  return api;
}
