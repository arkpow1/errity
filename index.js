const syncSleep = (ms) => {
  const initDate = Date.now();
  while (Date.now() < initDate + ms) {}
};

const asyncSleep = (ms) => new Promise((res) => setTimeout(res, ms));

function errity(cb, secondArg) {
  // The second argument can be onError function or a config
  const isFunction = typeof secondArg === "function";
  const isConfig = typeof secondArg === "object";
  const isAsync = cb.constructor.name === "AsyncFunction";

  const config = isConfig ? secondArg : {};
  const onErrorFunction = isFunction ? secondArg : undefined;

  const {
    onError = onErrorFunction,
    onRetryError,
    retryCount = 1,
    retryDelay = 0,
  } = config;

  const onLastError = (error) =>
    onError ? onError?.(error) : this?.defaultErrorCb?.(error);

  const pushToLogs = (error) => this?.logs.push(error);

  const asyncApply = async (fn, ctx, args) => {
    for (let i = 0; i < retryCount; i++) {
      if (retryDelay > 0 && i > 0) {
        await asyncSleep(retryDelay);
      }
      try {
        return await fn.apply(ctx, args);
      } catch (error) {
        if (this?.logs) {
          pushToLogs(error);
        }
        if (i === retryCount - 1) {
          onLastError(error);
        } else {
          onRetryError?.(error);
        }
      }
    }
  };

  const syncApply = (fn, ctx, args) => {
    for (let i = 0; i < retryCount; i++) {
      if (retryDelay > 0 && i > 0) {
        syncSleep(retryDelay);
      }

      try {
        return fn.apply(ctx, args);
      } catch (error) {
        if (this?.logs) {
          pushToLogs(error);
        }
        if (i === retryCount - 1) {
          onLastError(error);
        } else {
          onRetryError?.(error);
        }
      }
    }
  };

  return new Proxy(cb, {
    apply: isAsync ? asyncApply : syncApply,
  });
}

class Errity {
  logs;
  defaultErrorCb;

  constructor({ defaultErrorCb, logger } = {}) {
    this.defaultErrorCb = defaultErrorCb;
    this.errity = errity.bind(this);
    if (logger) {
      this.logs = [];
    }
  }
}

module.exports = { errity, Errity };
