import Shopify from '@shopify/shopify-api';

export const loadSession = (accessMode = 'online') => {
  return async (ctx, next) => {
    ctx.state.session = await Shopify.Utils.loadCurrentSession(
      ctx.req,
      ctx.res,
      accessMode === 'online'
    );
    await next();
  };
};
