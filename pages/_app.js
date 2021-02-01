import fetch from 'node-fetch';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import App from 'next/app';
import { AppProvider, Frame, Toast } from '@shopify/polaris';
import { Provider } from '@shopify/app-bridge-react';
import Cookies from 'js-cookie';
import { createContext } from 'react';
import '@shopify/polaris/dist/styles.css';
import translations from '@shopify/polaris/locales/en.json';
import '../styles/pages/_app.css';
import Head from 'next/head';
import { withErrorBoundary } from 'react-error-boundary';

import ErrorCommonFallBack from '../components/error/error_common_fallback';

const client = new ApolloClient({
  fetch,
  fetchOptions: {
    credentials: 'include',
  },
});

const AppContext = createContext({});
class MyApp extends App {
  constructor(props) {
    super(props);

    this.state = {
      toast: {
        content: '',
        shown: false,
        isError: false,
      },
      setToast: (toast) => this.setState((state) => ({ ...state, toast })),
    };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <AppProvider
        i18n={translations}
        features={{ newDesignLanguage: true }}
        theme={{
          colorScheme: 'light',
        }}
      >
        <Provider
          config={{
            // eslint-disable-next-line no-undef
            apiKey: API_KEY,
            shopOrigin: Cookies.get('shopOrigin'),
            forceRedirect: true,
          }}
        >
          <AppContext.Provider value={this.state}>
            <ApolloProvider client={client}>
              <Head>
                <script type="text/javascript" async defer>
                  window.$crisp=[];
                  window.CRISP_WEBSITE_ID="be5b7d93-53ac-4217-98ef-b5720a4d304c";
                  d=document; s=d.createElement("script");
                  s.src="https://client.crisp.chat/l.js";
                  s.async=1;d.getElementsByTagName("head")[0].appendChild(s);
                </script>
                <script src='https://cdn.shopify.com/s/javascripts/currencies.js' />
              </Head>
              <Frame>
                <Component {...pageProps} />
                {this.state.toast.shown && (
                  <Toast
                    error={this.state.toast.isError}
                    content={this.state.toast.content}
                    onDismiss={() =>
                      this.state.setToast({ ...this.state.toast, shown: false })
                    }
                  />
                )}
              </Frame>
            </ApolloProvider>
          </AppContext.Provider>
        </Provider>
      </AppProvider>
    );
  }
}

export default withErrorBoundary(MyApp, {
  FallbackComponent: ErrorCommonFallBack,
});
export { AppContext };
