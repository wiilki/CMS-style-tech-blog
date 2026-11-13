module.exports = (req, res, next) => {
  if (req.session?.user_id) return next();
  if (req.originalUrl.startsWith("/api/")) return res.status(401).json({ message: "Please log in to continue." });
  res.redirect("/login");
};