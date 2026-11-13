const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const port = process.env.PORT || 3001;
const production = process.env.NODE_ENV === "production";
if (production && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
  throw new Error("A SESSION_SECRET containing at least 32 characters is required in production.");
}

const hbs = exphbs.create({ helpers });
const store = new SequelizeStore({ db: sequelize });
app.disable("x-powered-by");
if (production) app.set("trust proxy", 1);
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false, limit: "100kb" }));
app.use(session({
  name: "byte.sid",
  secret: process.env.SESSION_SECRET || "development-only-session-secret-change-me",
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: production,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
  resave: false,
  rolling: true,
  saveUninitialized: false,
  store,
}));
app.use(express.static(path.join(__dirname, "public")));
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use(routes);
app.use((req, res) => {
  if (req.originalUrl.startsWith("/api/")) return res.status(404).json({ message: "API endpoint not found." });
  res.status(404).render("notFound", { loggedIn: Boolean(req.session?.loggedIn), pageTitle: "Page not found" });
});
app.use((error, req, res, _next) => {
  console.error("Request error:", error);
  if (req.originalUrl.startsWith("/api/")) return res.status(500).json({ message: "An unexpected error occurred." });
  res.status(500).render("error", { loggedIn: Boolean(req.session?.loggedIn), pageTitle: "Something went wrong" });
});

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();
  await store.sync();
  app.listen(port, "0.0.0.0", () => console.log("The Byte listening on port " + port));
}
if (require.main === module) {
  start().catch((error) => { console.error("Unable to start the application:", error); process.exit(1); });
}
module.exports = { app, start };