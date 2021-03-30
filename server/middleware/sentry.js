// Taken from https://docs.sentry.io/platforms/node/guides/koa/

import domain from 'domain';

import * as Sentry from '@sentry/node';
import {
  extractTraceparentData,
  stripUrlQueryAndFragment,
} from '@sentry/tracing';

export const sentryErrorMiddleware = (err, ctx) => {
  Sentry.withScope((scope) => {
    scope.addEventProcessor(function (event) {
      return Sentry.Handlers.parseRequest(event, ctx.request);
    });
    Sentry.captureException(err);
    console.error(err);
  });
};

export const sentryRequestMiddleware = (ctx, next) => {
  /* eslint-disable promise/param-names */
  // eslint-disable-next-line no-unused-vars
  return new Promise((resolve, _reject) => {
    const local = domain.create();
    local.add(ctx);
    local.on('error', (err) => {
      ctx.status = err.status || 500;
      ctx.body = err.message;
      ctx.app.emit('error', err, ctx);
    });
    local.run(async () => {
      Sentry.getCurrentHub().configureScope((scope) =>
        scope.addEventProcessor((event) =>
          Sentry.Handlers.parseRequest(event, ctx.request, { user: false })
        )
      );
      await next();
      resolve();
    });
  });
  /* eslint-enable promise/param-names */
};

export const sentryTracingMiddleware = async (ctx, next) => {
  const reqMethod = (ctx.method || '').toUpperCase();
  const reqUrl = ctx.url && stripUrlQueryAndFragment(ctx.url);

  // connect to trace of upstream app
  let traceparentData;
  if (ctx.request.get('sentry-trace')) {
    traceparentData = extractTraceparentData(ctx.request.get('sentry-trace'));
  }

  const transaction = Sentry.startTransaction({
    name: `${reqMethod} ${reqUrl}`,
    op: 'http.server',
    ...traceparentData,
  });

  // eslint-disable-next-line babel/camelcase
  ctx.__sentry_transaction = transaction;
  await next();

  // if using koa router, a nicer way to capture transaction using the matched route
  if (ctx._matchedRoute) {
    const mountPath = ctx.mountPath || '';
    transaction.setName(`${reqMethod} ${mountPath}${ctx._matchedRoute}`);
  }
  transaction.setHttpStatus(ctx.status);
  transaction.finish();
};
