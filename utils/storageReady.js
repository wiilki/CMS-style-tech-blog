// Cache successful storage initialization across serverless requests.
// A transient Neon cold-start connection error is retried, not permanently cached.
const TRANSIENT_CODES = new Set(["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "EAI_AGAIN", "57P03"]);

function isTransient(error) {
  const code = error?.parent?.code || error?.original?.code || error?.code;
  return TRANSIENT_CODES.has(code);
}

module.exports = function createStorageReady({ sequelize, store, maxAttempts = 3, retryDelayMs = 200 }) {
  let pending;

  async function initialize() {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await sequelize.authenticate();
        await sequelize.sync();
        await store.sync();
        return;
      } catch (error) {
        if (attempt === maxAttempts || !isTransient(error)) throw error;
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs * 2 ** (attempt - 1)));
      }
    }
  }

  return function ensureStorageReady() {
    if (!pending) {
      pending = initialize().catch((error) => {
        pending = undefined;
        throw error;
      });
    }
    return pending;
  };
};
