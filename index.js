const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf')

// create an instance of express app
let app = express();

// set the view engine
app.set("view engine", "hbs");

// static folder
app.use(express.static("public"));

// setup wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

// enable forms
app.use(
  express.urlencoded({
    extended: false
  })
);


// Register Flash middleware. The middleware always run for all routes. 
//app.use(function (req, res, next) {
//  res.locals.date = new Date(); // res.locals is response.locals
//  next(); // transfers to the next middleware or if none, will pass to the routes.
//});


app.use(function(req,res,next){
  res.locals.date = new Date();  // res.locals is response.locals
                                 // the locals object contain the variables for the hbs file
                                 // if we define res.lcoals.date, it means that ALL hbs files
                                 // have access to the date variable
  next();  // MUST call the next functiont to pass the request to next middleware, or if there
           // is no more middlewares,pass to the route.
})



// set up sessions
app.use(session({          //a session store determines how the session data is saved
  store: new FileStore(),  //if using a FileStore, we are saving it to a file.
  secret: process.env.SESSION_SECRET_KEY,
  // used for encrypting session ids
  resave: false,
  saveUninitialized: true  // if a request arrives with no session, create a new session
}))




app.use(flash())

// Register Flash middleware. The middleware always run for all routes. 
app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next(); // transfers to the next middleware or if none, will pass to the routes.
});

// Share the user data with hbs files
app.use(function(req,res,next){
  res.locals.user = req.session.user;
  next();
})


// enable CSRF
//app.use(csrf());

// note: replaced app.use(csrf()) with the following:
const csrfInstance = csrf();
app.use(function(req,res,next){
  console.log("checking for csrf exclusion")
  // exclude whatever url we want from CSRF protection
  if (req.url === "/checkout/process_payment") {
    return next();
  }else{
  csrfInstance(req,res,next);
  }
})



// check if there is a csrf error. If so, render a friendly error message
app.use(function(err, req, res, next){
  // check for bad csrf token error
 if (err && err.code == "EBADCSRFTOKEN") {
   req.flash('error_messages', 'The form has expired. Please try again.');
   res.redirect('back'); // 'back' means tell the browser go back to previous page
 } else {
   next();
 }
})

// share the csrf token with all hbs files
app.use(function(req,res,next){
 if (req.csrfToken) {
  res.locals.csrfToken = req.csrfToken();  // req.csrfToken() is available
 }
 // after we do `app.use(csrf())`
 next();
})

// import in routes
const landingRoutes = require('./routes/landing');
const productsRoutes = require('./routes/products');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary.js')
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout')


async function main() {
  app.use('/', landingRoutes);
  app.use('/', productsRoutes);
  app.use('/users', userRoutes);
  app.use('/cloudinary', cloudinaryRoutes);
  app.use('/cart', cartRoutes);
  app.use('/checkout', checkoutRoutes);
}

main();

app.listen(3000, () => {
  console.log("Server has started on http://localhost:3000/");
});