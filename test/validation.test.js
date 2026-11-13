const test = require("node:test");
const assert = require("node:assert/strict");
const { validId, validatePost, validateComment, validateSignup } = require("../utils/validation");

test("valid IDs must be positive integers", () => {
  assert.equal(validId("12"), true);
  for (const value of ["0", "-1", "abc", "1.5", "1 OR 1", null]) assert.equal(validId(value), false);
});
test("post input is trimmed and bounded", () => {
  assert.deepEqual(validatePost({ title: "  Useful tips  ", description: "  This is the complete article  " }), { valid: true, title: "Useful tips", description: "This is the complete article" });
  assert.equal(validatePost({ title: "Hi", description: "This is long enough" }).valid, false);
  assert.equal(validatePost({ title: "A good title", description: "short" }).valid, false);
  assert.equal(validatePost({ title: "A good title", description: "x".repeat(50001) }).valid, false);
  assert.equal(validatePost(null).valid, false);
});
test("comments require a real post and sensible length", () => {
  assert.deepEqual(validateComment({ post_id: "3", body: "Nice work" }), { valid: true, post_id: 3, body: "Nice work" });
  assert.equal(validateComment({ post_id: 0, body: "Nice work" }).valid, false);
  assert.equal(validateComment({ post_id: 3, body: "x".repeat(241) }).valid, false);
});
test("sign up rejects unsafe usernames and short passwords", () => {
  assert.equal(validateSignup({ username: "writer_4", password: "long-enough" }).valid, true);
  assert.equal(validateSignup({ username: "a b", password: "long-enough" }).valid, false);
  assert.equal(validateSignup({ username: "writer", password: "1234567" }).valid, false);
  assert.equal(validateSignup({ username: "writer", password: "x".repeat(129) }).valid, false);
});