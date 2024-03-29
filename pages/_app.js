import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import App from 'next/app';
import { Redirect } from '@shopify/app-bridge/actions';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { AppProvider as PolarisProvider, Frame } from '@shopify/polaris';
import {
  Provider as ShopifyAppBridgeProvider,
  Toast,
  useAppBridge,
} from '@shopify/app-bridge-react';
import React, { createContext } from 'react';
import '@shopify/polaris/build/esm/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import Head from 'next/head';
import * as Sentry from '@sentry/react';

import '../styles/pages/_app.scss';
import '../styles/pages/pricing.scss';
import '../styles/pages/index.scss';
import '../styles/pages/campaigns/new.scss';

import ClientRouter from '../components/client_router';
import AppError from '../components/error/_app';

// eslint-disable-next-line no-undef
Sentry.init({ dsn: SENTRY_DSN_DASHBOARD });

const AppContext = createContext({});

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1'
    ) {
      const authUrlHeader = response.headers.get(
        'X-Shopify-API-Request-Failure-Reauthorize-Url'
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}

const GraphQLProvider = (props) => {
  const app = useAppBridge();

  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      fetch: userLoggedInFetch(app),
      fetchOptions: {
        credentials: 'include',
      },
    }),
  });

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
};

class MyApp extends App {
  constructor(props) {
    super(props);
    let host;
    if (typeof window === 'undefined') {
      host = this.props.router.query.host;
    } else {
      const params = new URLSearchParams(window.location.search);
      host = params.get('host');
    }

    this.state = {
      toast: {
        content: '',
        shown: false,
        isError: false,
      },
      setToast: (toast) => this.setState((state) => ({ ...state, toast })),
      host,
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <script type="text/javascript" async defer>
            window.$crisp=[];
            window.$crisp.push(["safe", true]);
            window.CRISP_WEBSITE_ID="be5b7d93-53ac-4217-98ef-b5720a4d304c";
            d=document; s=d.createElement("script");
            s.src="https://client.crisp.chat/l.js";
            s.async=1;d.getElementsByTagName("head")[0].appendChild(s);
          </script>
          <script src="https://cdn.shopify.com/s/javascripts/currencies.js" />
          <script src="https://www.googletagmanager.com/gtag/js?id=G-3ZNV23GBS4" />
          <script
            async
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-3ZNV23GBS4');`,
            }}
          />
        </Head>
        <ShopifyAppBridgeProvider
          config={{
            // eslint-disable-next-line no-undef
            apiKey: API_KEY,
            host: this.state.host,
            forceRedirect: true,
          }}
        >
          <ClientRouter />
          <PolarisProvider
            i18n={translations}
            features={{ newDesignLanguage: true }}
            theme={{ colorScheme: 'light' }}
          >
            <AppContext.Provider value={this.state}>
              <GraphQLProvider>
                <Frame>
                  <Component {...pageProps} />
                  {this.state.toast.shown && (
                    <Toast
                      error={this.state.toast.isError}
                      content={this.state.toast.content}
                      onDismiss={() =>
                        this.state.setToast({
                          ...this.state.toast,
                          shown: false,
                        })
                      }
                    />
                  )}
                </Frame>
              </GraphQLProvider>
            </AppContext.Provider>
          </PolarisProvider>
        </ShopifyAppBridgeProvider>
      </>
    );
  }
}

export default Sentry.withErrorBoundary(MyApp, {
  fallback: AppError,
});
export { AppContext };
