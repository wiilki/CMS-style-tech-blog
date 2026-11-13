const test = require("node:test");
const assert = require("node:assert/strict");

const connectionPath = require.resolve("../config/connection");

function loadWithEnvironment(overrides) {
  const previous = Object.fromEntries(
    Object.keys(overrides).map((key) => [key, process.env[key]])
  );
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  delete require.cache[connectionPath];
  try {
    return require("../config/connection");
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    delete require.cache[connectionPath];
  }
}

test("PostgreSQL driver is explicitly loaded for serverless deployment", () => {
  const connection = loadWithEnvironment({
    DATABASE_URL: "postgres://example:pass@localhost:5432/example",
  });
  assert.equal(connection.getDialect(), "postgres");
  assert.equal(connection.options.dialectModule, require("pg"));
});

test("legacy MySQL configuration retains its explicit driver", () => {
  const connection = loadWithEnvironment({ DATABASE_URL: undefined, JAWSDB_URL: undefined });
  assert.equal(connection.getDialect(), "mysql");
  assert.equal(connection.options.dialectModule, require("mysql2"));
});
