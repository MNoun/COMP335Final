var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var app = express();
var session = require("cookie-session");
var flash = require("express-flash");
var env = require("dotenv").config();
const Client = require("pg").Client;
var bcrypt = require("bcryptjs");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

const client = (() => {
  if (process.env.NODE_ENV !== "production") {
      return new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: false
      });
  } else {
      return new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: {
              rejectUnauthorized: false
            }
      });
  } })();

client.connect();

passport.use(new LocalStrategy({
  usernameField: "username",
  passwordField: "password"
  },
  function(username, password, done) {
  client.query("SELECT * FROM dealsUsers WHERE username = $1", [username], function(err, result) {
    if (err) {
      console.log("SQL error");
      return done(null,false, {message: "sql error"});
    }
    if (result.rows.length > 0) {
      var matched = bcrypt.compareSync(password, result.rows[0].password);
      if (matched) {
        console.log("Successful login, ", result.rows[0]);
        return done(null, result.rows[0]);
      }
    }
    console.log("Bad username or password");
    return done(null, false, {message: "Bad username or password"});
  });
})
);

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(id, done) {
  return done(null, id);
});

app.set("trust proxy", 1)
app.use(session({
  secret: "WebDev",
  resave:false,
  saveUninitialized: true,
  cookie: {
    secure: (process.env.NODE_ENV && process.env.NODE_ENV == "production") ? true:false
  }
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

///router
app.use("/", indexRouter);
app.use("/users", usersRouter);

module.exports = app;