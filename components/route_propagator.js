import {
  useAppBridge,
  RoutePropagator as ShopifyRoutePropagator,
} from '@shopify/app-bridge-react';
import { useRouter } from 'next/router';
import { Redirect } from '@shopify/app-bridge/actions';
import { useEffect } from 'react';

const RoutePropagator = () => {
  const router = useRouter();
  const { route } = router;
  const app = useAppBridge();

  useEffect(() => {
    app.subscribe(Redirect.ActionType.APP, ({ path }) => {
      router.push(path);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return app && route ? <ShopifyRoutePropagator location={route} /> : null;
};

export default RoutePropagator;
