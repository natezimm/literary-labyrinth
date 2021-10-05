const express         = require("express"),
      app             = express(),
      bodyParser      = require("body-parser"),
      mongoose        = require("mongoose"),
      passport        = require("passport"),
      LocalStrategy   = require("passport-local"),
      Book            = require("./models/book"),
      Comment         = require("./models/comment"),
      User            = require("./models/user"),
      methodOverride  = require("method-override"),
      flash           = require("connect-flash");

const commentRoutes   = require("./routes/comments"),
      bookRoutes      = require("./routes/books"),
      indexRoutes     = require("./routes/index");

const port = process.env.PORT || 3000;

const MONGODB_URI = process.env.databaseURL || 'mongodb://localhost:27017/literary_labyrinth';
mongoose.connect(MONGODB_URI, {
	  useNewUrlParser: true,
	  dbName: "literary_labyrinth",
	  useFindAndModify: false,
    useUnifiedTopology: true
}, ).then(() => {
	  console.log('Connected to DB!');
}).catch(err => {
	  console.log('ERROR:', err.message);
});

// mongoose.connect('mongodb://localhost:27017/literary_labyrinth',
//   {
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true
//   }
// );

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Once again, this is the secret page.",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/books", bookRoutes);
app.use("/books/:id/comments", commentRoutes);

app.listen(port, function(){
    console.log("The Literary Labyrinth Server has started!");
});