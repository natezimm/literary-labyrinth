const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const middleware = require("../middleware");

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
   const name = req.body.name;
   const writer = req.body.writer;
   const price = req.body.price;
   const image = req.body.image;
   const desc = req.body.description;
   const author = {
       id: req.user._id,
       username: req.user.username
   }
   const newBook = {name: name, writer: writer, price: price, image: image, description: desc, author: author};
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