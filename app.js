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

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

const MONGODB_URI = 'mongodb+srv://literary:labyrinth@literary-labyrinth.ddlwh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.promise = Promise;

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

app.listen(app.get('port'), function() {
	console.log('App running on ', app.get('port'));
});