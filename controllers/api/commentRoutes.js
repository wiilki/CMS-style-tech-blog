const router = require("express").Router();
const { Comment, Post } = require("../../models");
const withAuth = require("../../utils/auth");
const { validateComment, validId } = require("../../utils/validation");

router.get("/", async (req, res, next) => {
  try { res.json(await Comment.findAll({ attributes: ["id", "body", "post_id", "date_created"], order: [["date_created", "DESC"]] })); }
  catch (error) { next(error); }
});
router.post("/", withAuth, async (req, res, next) => {
  const data = validateComment(req.body);
  if (!data.valid) return res.status(400).json({ message: data.message });
  try {
    const post = await Post.findByPk(data.post_id);
    if (!post) return res.status(404).json({ message: "Story not found." });
    const comment = await Comment.create({ body: data.body, post_id: data.post_id, user_id: req.session.user_id });
    res.status(201).json({ id: comment.id });
  } catch (error) { next(error); }
});
router.delete("/:id", withAuth, async (req, res, next) => {
  if (!validId(req.params.id)) return res.status(404).json({ message: "Comment not found." });
  try {
    const deleted = await Comment.destroy({ where: { id: req.params.id, user_id: req.session.user_id } });
    if (!deleted) return res.status(404).json({ message: "Comment not found or you do not own it." });
    res.json({ deleted: true });
  } catch (error) { next(error); }
});
module.exports = router;