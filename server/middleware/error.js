const globalErrorHandler = async (ctx, nxt) => {
  try {
    await nxt();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
};

export default globalErrorHandler;
