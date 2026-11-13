const { test } = require("node:test");
const assert = require("node:assert/strict");
const createStorageReady = require("../utils/storageReady");

const transient = () => Object.assign(new Error("Temporary database socket disconnect"), { parent: { code: "ECONNRESET" } });

test("storage initialization is shared between concurrent requests", async () => {
  let authenticated = 0;
  let schemaSyncs = 0;
  let sessionSyncs = 0;
  const ready = createStorageReady({
    sequelize: {
      authenticate: async () => { authenticated += 1; },
      sync: async () => { schemaSyncs += 1; },
    },
    store: { sync: async () => { sessionSyncs += 1; } },
    retryDelayMs: 0,
  });
  await Promise.all([ready(), ready(), ready()]);
  await ready();
  assert.deepEqual([authenticated, schemaSyncs, sessionSyncs], [1, 1, 1]);
});

test("retries a transient Neon connection failure", async () => {
  let attempts = 0;
  const ready = createStorageReady({
    sequelize: {
      authenticate: async () => { if (++attempts === 1) throw transient(); },
      sync: async () => {},
    },
    store: { sync: async () => {} },
    retryDelayMs: 0,
  });
  await ready();
  assert.equal(attempts, 2);
});

test("failed initialization can be retried on the next request", async () => {
  let attempts = 0;
  let available = false;
  const ready = createStorageReady({
    sequelize: {
      authenticate: async () => { attempts += 1; if (!available) throw transient(); },
      sync: async () => {},
    },
    store: { sync: async () => {} },
    maxAttempts: 3,
    retryDelayMs: 0,
  });
  await assert.rejects(ready(), /Temporary database socket disconnect/);
  assert.equal(attempts, 3);
  available = true;
  await ready();
  assert.equal(attempts, 4);
});

test("nontransient database errors are not retried repeatedly", async () => {
  let attempts = 0;
  const ready = createStorageReady({
    sequelize: {
      authenticate: async () => { attempts += 1; throw Object.assign(new Error("Bad credentials"), { code: "28P01" }); },
      sync: async () => {},
    },
    store: { sync: async () => {} },
    retryDelayMs: 0,
  });
  await assert.rejects(ready(), /Bad credentials/);
  assert.equal(attempts, 1);
});
