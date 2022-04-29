var express = require("express");
var router = express.Router();
var path = require("path");
var env = require("dotenv").config();
const Client = require("pg").Client;

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

//start of page routing
  router.get("/", function(req, res, next) {
    res.render("index", { title: "Express" });
  });

  router.get("/deals", function(req, res, next) {
    res.sendFile(path.join(__dirname,"..", "public","deals.html"));
  });

  router.get("/profile", function(req, res, next) {
    res.sendFile(path.join(__dirname,"..", "public","profile.html"));
  });
//end of page routing

//get users name
router.get("/whoami",function(req,res,next) {
  res.json({"user": req.user.username});
});

//display the database table
router.get("/shoppingListOut",function(req, res, next){
  client.query("SELECT * FROM shoppingList WHERE username=$1",[req.user.username], function(err,result){
    if (err) {
      next(err);
    }
    else if (result.rows.length > 0) {
      res.json(result.rows);
    }
    else{
      let username=req.user.username;
      res.redirect("/users/signup");
    }
  });
});

//delete all entries for the current user
router.post("/clearList",function(req, res, next) {
  client.query("SELECT * FROM shoppingList WHERE username = $1", [req.user.username], function(err, result) {
    if (err) {
      console.log("unable to query SELECT");
      next(err);
    }
    if (result.rows.length > 0) {
        console.log("User exist. Let's empty their shopping list.");
        client.query("DELETE FROM shoppingList WHERE username = $1", [req.user.username], function(err, result) {
          if (err) {
            console.log("unable to query INSERT");
            next(err);
          }
          console.log("shopping list cleared succesfully");
          res.redirect("/profile");
        });
    }
    else {
      console.log("user doesn't exist");
      res.redirect("/profile");
    }
  });
});

//add an item to the database table
router.post("/addItem",function(req, res, next) {
  client.query("SELECT * FROM dealsUsers WHERE username = $1", [req.user.username], function(err, result) {
    if (err) {
      console.log("unable to query SELECT");
      next(err);
    }
    if (result.rows.length > 0) {
        console.log("User exist. Let's add the item");
        client.query("INSERT INTO shoppingList (username, item) VALUES($1, $2)", [req.user.username, req.body.item], function(err, result) {
          if (err) {
            console.log("unable to query INSERT");
            next(err);
          }
          console.log("Item added successfully");
          res.redirect("/profile");

        });
    }
    else {
      console.log("user doesn't exist");
      res.redirect("/profile");
    }
  });
});

module.exports = router;