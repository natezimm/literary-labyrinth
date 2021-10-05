var express = require("express");
var router = express.Router();
var Book = require("../models/book");
var middleware = require("../middleware");

router.get("/", function(req, res){
    Book.find({}, function(err, allBooks){
       if(err){
           console.log(err);
       } else {
            res.render("books/index", {books: allBooks, currentUser: req.user});
       }
    });
});

router.post("/", middleware.isLoggedIn, function(req, res){
   var name = req.body.name;
   var writer = req.body.writer;
   var price = req.body.price;
   var image = req.body.image;
   var desc = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   }
   var newBook = {name: name, writer: writer, price: price, image: image, description: desc, author: author};
   Book.create(newBook, function(err, newlyCreated){
       if(err){
           console.log(err);
       } else {
           req.flash("success", "Successfully added book");
           res.redirect("/books");
       }
   });
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("books/new"); 
});

router.get("/:id", function(req, res){
    Book.findById(req.params.id).populate("comments").exec(function(err, foundBook){
        if(err){
            console.log(err);
        } else {
            res.render("books/show", {book: foundBook});
        }
    });
});

router.get("/:id/edit", middleware.checkBookOwnership, function(req, res){
    Book.findById(req.params.id, function(err, foundBook){
        res.render("books/edit", {book: foundBook});
        });    
});

router.put("/:id", middleware.checkBookOwnership, function(req, res){
    Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook){
        if(err){
            res.redirect("/books");
        } else {
            res.redirect("/books/" + req.params.id);
        }
    })
});

router.delete("/:id", middleware.checkBookOwnership, function(req, res){
  Book.findByIdAndRemove(req.params.id, function(err){
      if(err){
          res.redirect("/books");
      } else {
          req.flash("success", "Book deleted");
          res.redirect("/books");
      }
  }) 
});

module.exports = router;