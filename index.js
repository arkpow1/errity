function errity(cb, onError) {
  const isAsync = cb.constructor.name == "AsyncFunction";

  const asyncApply = async (fn, ctx, args) => {
    try {
      return await fn.apply(ctx, args);
    } catch (err) {
      onError?.(err);
    }
  };
  const syncApply = (fn, ctx, args) => {
    try {
      return fn.apply(ctx, args);
    } catch (err) {
      onError?.(err);
    }
  };

  return new Proxy(cb, {
    apply: isAsync ? asyncApply : syncApply,
  });
}

module.exports = errity;
