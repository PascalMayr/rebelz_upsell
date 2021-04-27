import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import App from 'next/app';
import { Redirect } from '@shopify/app-bridge/actions';
import { authenticatedFetch } from '@shopify/app-bridge-utils';
import { AppProvider as PolarisProvider, Frame } from '@shopify/polaris';
import {
  Provider as ShopifyAppBridgeProvider,
  Toast,
  Context as ShopifyAppContext,
} from '@shopify/app-bridge-react';
import React, { createContext } from 'react';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import Head from 'next/head';
import * as Sentry from '@sentry/react';

import '../styles/pages/_app.css';
import ClientRouter from '../components/client_router';
import RoutePropagator from '../components/route_propagator';
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

class GraphQLProvider extends React.Component {
  // eslint-disable-next-line @shopify/react-prefer-private-members
  static contextType = ShopifyAppContext;

  render() {
    const app = this.context;

    const client = new ApolloClient({
      fetch: userLoggedInFetch(app),
      fetchOptions: {
        credentials: 'include',
      },
    });

    return (
      <ApolloProvider client={client}>{this.props.children}</ApolloProvider>
    );
  }
}

class MyApp extends App {
  constructor(props) {
    super(props);
    let shop;
    if (typeof window === 'undefined') {
      shop = this.props.router.query.shop;
    } else {
      shop = new URLSearchParams(window.location.search).get('shop');
    }

    this.state = {
      toast: {
        content: '',
        shown: false,
        isError: false,
      },
      setToast: (toast) => this.setState((state) => ({ ...state, toast })),
      shop,
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <>
        <Head>
          <script type="text/javascript" async defer>
            window.$crisp=[];
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
            shopOrigin: this.state.shop,
            forceRedirect: true,
          }}
        >
          <ClientRouter />
          <RoutePropagator />
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
