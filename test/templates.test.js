const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Handlebars = require("handlebars");
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
test("all Handlebars templates compile", () => {
  const files = walk(path.join(__dirname, "..", "views")).filter((file) => file.endsWith(".handlebars"));
  assert.ok(files.length >= 10);
  for (const file of files) assert.doesNotThrow(() => Handlebars.precompile(fs.readFileSync(file, "utf8")), file);
});