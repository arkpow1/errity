function errity(cb, onError) {
  const isAsync = cb.constructor.name == "AsyncFunction";

  const asyncApply = async (fn, ctx, args) => {
    try {
      return await fn.apply(ctx, args);
    } catch (err) {
      onError ? onError?.(err) : this?.defaultErrorCb?.(err);
    }
  };
  const syncApply = (fn, ctx, args) => {
    try {
      return fn.apply(ctx, args);
    } catch (err) {
      onError ? onError?.(err) : this?.defaultErrorCb?.(err);
    }
  };

  return new Proxy(cb, {
    apply: isAsync ? asyncApply : syncApply,
  });
}

class Errity {
  constructor({ defaultErrorCb }) {
    this.defaultErrorCb = defaultErrorCb;
    this.errity = errity.bind(this);
  }
}

module.exports = { errity, Errity };
