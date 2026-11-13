const validId = (id) => /^[1-9]\d*$/.test(String(id ?? ""));
const clean = (value) => typeof value === "string" ? value.trim() : "";
const validatePost = (body) => {
  const title = clean(body?.title);
  const description = clean(body?.description);
  if (title.length < 3 || title.length > 150) return { valid: false, message: "A title must be 3–150 characters long." };
  if (description.length < 10 || description.length > 50000) return { valid: false, message: "A story must be 10–50,000 characters long." };
  return { valid: true, title, description };
};
const validateComment = (body) => {
  const text = clean(body?.body);
  if (!validId(body?.post_id)) return { valid: false, message: "Choose a valid story." };
  if (text.length < 2 || text.length > 240) return { valid: false, message: "A comment must be 2–240 characters long." };
  return { valid: true, post_id: Number(body.post_id), body: text };
};
const validateSignup = (body) => {
  const username = clean(body?.username);
  const password = typeof body?.password === "string" ? body.password : "";
  if (!/^[A-Za-z0-9_-]{3,30}$/.test(username)) return { valid: false, message: "Username must contain 3–30 letters, numbers, underscores, or hyphens." };
  if (password.length < 8 || password.length > 128) return { valid: false, message: "Password must contain 8–128 characters." };
  return { valid: true, username, password };
};
module.exports = { validId, validatePost, validateComment, validateSignup };