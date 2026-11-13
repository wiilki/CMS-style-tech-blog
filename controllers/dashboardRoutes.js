const router = require("express").Router();
const { Post } = require("../models");
const withAuth = require("../utils/auth");

router.use(withAuth);
router.get("/", async (req, res, next) => {
  try {
    const records = await Post.findAll({ where: { user_id: req.session.user_id }, order: [["date_created", "DESC"]] });
    const posts = records.map((post) => post.get({ plain: true }));
    res.render("dashboard", { posts, loggedIn: true, isDashboard: true, pageTitle: "Writing studio" });
  } catch (error) { next(error); }
});
router.get("/create", (req, res) => {
  res.render("newPost", { loggedIn: true, isDashboard: true, pageTitle: "New story" });
});
router.get("/edit/:id", async (req, res, next) => {
  try {
    if (!/^[1-9]\d*$/.test(req.params.id)) return res.status(404).render("notFound", { loggedIn: true });
    const record = await Post.findOne({ where: { id: req.params.id, user_id: req.session.user_id } });
    if (!record) return res.status(404).render("notFound", { loggedIn: true, pageTitle: "Story not found" });
    res.render("editPost", { post: record.get({ plain: true }), loggedIn: true, isDashboard: true, pageTitle: "Edit story" });
  } catch (error) { next(error); }
});
module.exports = router;