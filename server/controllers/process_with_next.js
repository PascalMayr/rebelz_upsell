const processWithNext = (app) => {
  const handle = app.getRequestHandler();

  return async function (ctx) {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };
};

export default processWithNext;
