const test = require("node:test");
const assert = require("node:assert/strict");
const h = require("../utils/helpers");
test("excerpts preserve short text and truncate long text", () => {
  assert.equal(h.excerpt("A short article", 50), "A short article");
  assert.match(h.excerpt("An article with a long and detailed explanation that goes on", 25), /…$/);
});
test("reading times are at least one minute and grow with length", () => {
  assert.equal(h.reading_time(""), 1);
  assert.equal(h.reading_time("hello world"), 1);
  assert.equal(h.reading_time("word ".repeat(441)), 3);
});
test("presentation helpers handle missing values", () => {
  assert.equal(h.initial(null), "?");
  assert.equal(h.initial("alex"), "A");
  assert.equal(h.card_color(6), 1);
  assert.match(h.format_date("2026-11-13"), /2026/);
});