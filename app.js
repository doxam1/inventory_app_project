const express = require("express");
require("dotenv").config();

const pool = require("./db/pool");
const app = express();
const PORT = process.env.PORT || 3000;
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      store: pool,
    }),
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    // Insert express-session options here
  })
);
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

const { indexRouter } = require("./routes/indexRouter");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      if (user.password !== password) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.post(
  "/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
  })
);
app.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.use("/", indexRouter);

app.use((req, res, next) => {
  res
    .status(404)
    .render("pages/error", { err: "Path not found", title: "OOPS..." });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("pages/error", { err: err.message, title: "OOPS..." });
});

app.listen(PORT, () => console.log(`app on port ${PORT}`));
