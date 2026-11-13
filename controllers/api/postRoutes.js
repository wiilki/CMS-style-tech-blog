const router = require("express").Router();
const { Post, User, Comment } = require("../../models");
const sequelize = require("../../config/connection");
const withAuth = require("../../utils/auth");
const { validatePost, validId } = require("../../utils/validation");
const author = { model: User, attributes: ["id", "username"] };

router.get("/", async (req, res, next) => {
  try { res.json(await Post.findAll({ include: [author], order: [["date_created", "DESC"]] })); }
  catch (error) { next(error); }
});
router.get("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(404).json({ message: "Story not found." });
    const post = await Post.findByPk(req.params.id, { include: [author, { model: Comment, include: [author] }] });
    if (!post) return res.status(404).json({ message: "Story not found." });
    res.json(post);
  } catch (error) { next(error); }
});
router.post("/", withAuth, async (req, res, next) => {
  const data = validatePost(req.body);
  if (!data.valid) return res.status(400).json({ message: data.message });
  try {
    const post = await Post.create({ title: data.title, description: data.description, user_id: req.session.user_id });
    res.status(201).json({ id: post.id, title: post.title });
  } catch (error) { next(error); }
});
router.put("/:id", withAuth, async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(404).json({ message: "Story not found." });
  const data = validatePost(req.body);
  if (!data.valid) return res.status(400).json({ message: data.message });
  try {
    const [count] = await Post.update({ title: data.title, description: data.description }, { where: { id: req.params.id, user_id: req.session.user_id } });
    if (!count) return res.status(404).json({ message: "Story not found or you do not own it." });
    res.json({ updated: true });
  } catch (error) { next(error); }
});
router.delete("/:id", withAuth, async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(404).json({ message: "Story not found." });
  try {
    const deleted = await sequelize.transaction(async (transaction) => {
      const post = await Post.findOne({ where: { id: req.params.id, user_id: req.session.user_id }, transaction });
      if (!post) return false;
      await Comment.destroy({ where: { post_id: post.id }, transaction });
      await post.destroy({ transaction });
      return true;
    });
    if (!deleted) return res.status(404).json({ message: "Story not found or you do not own it." });
    res.json({ deleted: true });
  } catch (error) { next(error); }
});
module.exports = router;