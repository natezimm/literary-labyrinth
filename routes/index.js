var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//Route Route
router.get("/", function(req, res){
   res.render("landing"); 
});

//Register Form Route
router.get("/register", function(req, res){
   res.render("register");
});
//Handles Sign Up Logic
router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Welcome to Literary Labyrinth " + user.username);
           res.redirect("/books"); 
        });
    });
});

//Show Login Form
router.get("/login", function(req, res){
   res.render("login");
});

//Handling Login Logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/books",
        failureRedirect: "/login"
    }), function(req, res){
});

//Logout Route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/books");
});

module.exports = router;