var express = require('express');
var router = express.Router();
var path = require('path');
var env = require('dotenv').config();
var passport = require('passport');
var bcrypt = require('bcryptjs');
const Client = require('pg').Client;

const client = (() => {
  if (process.env.NODE_ENV !== 'production') {
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

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function loggedIn(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.redirect('/users/login');
  }
}

router.get('/profile',loggedIn, function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public','profile.html'));
});

function notLoggedIn(req, res, next) {
  if (!req.user) {
    next();
  } else {
    let prefer = req.user.prefer;
    res.redirect('/users/profile?name='+prefer);
  }
}

router.get('/login', notLoggedIn, function(req, res){
  res.sendFile(path.join(__dirname,'..', 'public','login.html'));
});

router.post('/login',
  passport.authenticate('local', { failureRedirect: 'login?message=Incorrect+credentials', failureFlash:true }),
  function(req, res,next) {
    res.redirect('/users/profile');
});

router.get('/signup',function(req, res) {
  if(req.user) {
    let prefer = req.user.prefer;
    return res.redirect('/users/profile?name='+prefer);
  }
  res.sendFile(path.join(__dirname,'..', 'public','signup.html'));
});

function createUser(req, res, next){
  var salt = bcrypt.genSaltSync(10);
  var password = bcrypt.hashSync(req.body.password, salt);

  client.query('INSERT INTO dealsUsers (username, password) VALUES($1, $2)', [req.body.username, password], function(err, result) {
    if (err) {
      console.log("unable to query INSERT");
      return next(err);
    }
    console.log("User creation is successful");
    res.redirect('/users/login?message=We+created+your+account+successfully!');
  });
}

router.post('/signup', function(req, res, next) {
  client.query('SELECT * FROM dealsUsers WHERE username=$1',[req.body.username], function(err,result){
    if (err) {
      console.log("sql error ");
      next(err);
    }
    else if (result.rows.length > 0) {
      console.log("user exists");
      res.redirect('/users/signup?error=User+exists');
    }
    else {
      console.log("no user with that name");
      createUser(req, res, next);
    }
  });
});

router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;