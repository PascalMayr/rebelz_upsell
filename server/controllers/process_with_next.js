const processWithNext = (appHandler) => {
  return async function (ctx) {
    await appHandler(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };
};

export default processWithNext;
