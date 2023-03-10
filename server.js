const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const store = new SequelizeStore({ db: sequelize });

store.sync();

const sess = {
  secret: "Super secret secret",
  cookie: {
    // Session will automatically expire in 10 minutes
    expires: 10 * 60 * 1000,
  },
  resave: false,
  rolling: true,
  saveUninitialized: true,
  store,
};


app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(routes);

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);

