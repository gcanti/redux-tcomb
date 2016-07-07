function createCheckedMiddleware(Action) {
  return function (/* store */) {
    return function (next) {
      return function (action) {
        if (process.env.NODE_ENV !== 'production') {
          Action(action)
        }
        return next(action)
      };
    };
  };
}

module.exports = createCheckedMiddleware;