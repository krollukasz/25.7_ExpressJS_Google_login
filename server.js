var express = require("express");
var passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var config = require("./config");
var app = express();
var googleProfile = {};

app.set("view engine", "pug");
app.set("views", "./views");
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("views"));

// Serializowanie i deserializowanie użytkownika do sesji
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

// Tworzenie instancji klasy
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: config.CALLBACK_URL
  },
  function(accessToken, refreshToken, profile, cb) {
    googleProfile = {
      id: profile.id,
      displayName: profile.displayName
    };
    cb(null, profile);
  }
));

app.get("/", function(req, res) {
  res.render("index.pug", {
    user: req.user
  });
});

app.get("/logged", function(req, res) {
  res.render("userlogged.pug", { 
    user: googleProfile
  });
});

app.get("/auth/google",
  passport.authenticate("google", {
    scope : ["profile", "email"]
  })
);

app.get("/auth/google/callback",
  passport.authenticate("google", {
    successRedirect : "/logged",
    failureRedirect : "/"
  })
);

var server = app.listen(3000, "localhost", function() {
  var host = server.address().address;
  var port = server.address().port;
});