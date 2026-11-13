const router = require("express").Router();
const { Post, User, Comment } = require("../models");

const postIncludes = [
  { model: User, attributes: ["id", "username"] },
  { model: Comment, include: [{ model: User, attributes: ["id", "username"] }], order: [["date_created", "ASC"]] },
];

router.get("/", async (req, res, next) => {
  try {
    const records = await Post.findAll({ include: [{ model: User, attributes: ["id", "username"] }], order: [["date_created", "DESC"]] });
    const posts = records.map((post) => post.get({ plain: true }));
    res.render("homepage", { posts, featured: posts[0], isHome: true, loggedIn: Boolean(req.session.loggedIn), pageTitle: "Explore" });
  } catch (error) { next(error); }
});

router.get("/posts/:id", async (req, res, next) => {
  try {
    if (!/^[1-9]\d*$/.test(req.params.id)) return res.status(404).render("notFound", { pageTitle: "Story not found" });
    const record = await Post.findOne({ where: { id: req.params.id }, include: postIncludes });
    if (!record) return res.status(404).render("notFound", { pageTitle: "Story not found", loggedIn: Boolean(req.session.loggedIn) });
    const post = record.get({ plain: true });
    post.comments = post.comments.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));
    res.render("newComment", { post, loggedIn: Boolean(req.session.loggedIn), pageTitle: post.title });
  } catch (error) { next(error); }
});

router.get("/login", (req, res) => {
  if (req.session.loggedIn) return res.redirect("/dashboard");
  res.render("login", { pageTitle: "Log in" });
});
router.get("/signup", (req, res) => {
  if (req.session.loggedIn) return res.redirect("/dashboard");
  res.render("signup", { pageTitle: "Join" });
});

module.exports = router;