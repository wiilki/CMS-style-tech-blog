const router = require("express").Router();
const { User } = require("../../models");
const { validateSignup } = require("../../utils/validation");

router.post("/", async (req, res, next) => {
  const data = validateSignup(req.body);
  if (!data.valid) return res.status(400).json({ message: data.message });
  try {
    const existing = await User.findOne({ where: { username: data.username } });
    if (existing) return res.status(409).json({ message: "This username is already taken. Try another." });
    const user = await User.create({ username: data.username, password: data.password });
    req.session.regenerate((error) => {
      if (error) return next(error);
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;
      req.session.save((saveError) => saveError ? next(saveError) : res.status(201).json({ id: user.id, username: user.username }));
    });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") return res.status(409).json({ message: "This username is already taken. Try another." });
    next(error);
  }
});
router.post("/login", async (req, res, next) => {
  const username = typeof req.body?.username === "string" ? req.body.username.trim() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!username || !password) return res.status(400).json({ message: "Enter your username and password." });
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !user.checkPassword(password)) return res.status(401).json({ message: "Incorrect username or password." });
    req.session.regenerate((error) => {
      if (error) return next(error);
      req.session.user_id = user.id;
      req.session.username = user.username;
      req.session.loggedIn = true;
      req.session.save((saveError) => saveError ? next(saveError) : res.json({ id: user.id, username: user.username }));
    });
  } catch (error) { next(error); }
});
router.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) return next(error);
    res.clearCookie("byte.sid");
    res.status(204).end();
  });
});
module.exports = router;