const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", function(req, res){
   res.render("landing"); 
});

router.get("/register", function(req, res){
   res.render("register");
});

router.post("/register", function(req, res){
    const newUser = new User({username: req.body.username});
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

router.get("/login", function(req, res){
   res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/books",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/books");
});

module.exports = router;