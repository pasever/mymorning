const express = require('express'),
  expressSanitizer = require('express-sanitizer'),
  { check, validationResult } = require('express-validator/check'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  request = require('request'),
  exphbs = require('express-handlebars'), 
  bcrypt = require('bcrypt'),
  logger = require('morgan'),
  PORT = process.env.PORT || 8000,
  app = express(),
  db = require('./models');
 

//session storage module

//const MongoStore = require('connect-mongo')(session);

// deleting the session after logout
// app.get('logout', (req, res) =>{
//   if(req.session) {
//     req.session.destroy(err => {
//       throw err;
//     }) else {
//       res.redirect('/');
//     }
//   }
// });

//setting up our session
app.use(session({
              secret: "I love New York",
              resave: true,
   saveUninitialized: false
  // mongooseConnection: db
}));

async function verifyUser(email, password) {
    const user = await db.User.findOne({email});
    const dbPassword = user.password;
    const isValid = await bcrypt.compare(password, dbPassword);
    return {isValid, user};
}

 // express settings
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use(logger("dev"));

app.use(expressSanitizer());

//mongo settings
mongoose.connect("mongodb://localhost/detais");
mongoose.connection.on('error', console.error.bind(console, 'connection error'));

//handlebars settings 
app.engine("handlebars", exphbs({
  defaultLayout: "main",
  layoutsDir: app.get('views') + '/layouts',
  partialsDir: [app.get('views') + '/partials']
}));

app.set("view engine", "handlebars");

// routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/profile", (req, res)=> {
  const { user } = req.session;
  res.render("profile", {user});
});

app.post("/login", async (req, res, next) => {
 
  const { email, password } = req.body;
  
  try {
    const isValidObject = await verifyUser(email, password, next);
    if (!isValidObject.isValid) throw new Error('The username or password you entered is incorrect.');
    req.session.user = isValidObject.user;
    res.redirect('/profile');
  } catch (error) {
    error.message = 'The username or password you entered is incorrect.';
    res.render('login', { error });
  }

});


app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", (req, res) => {
 
const { firstName, lastName, email, password, confirmedPassword } = req.body;
 
    if (password !== confirmedPassword) {
       let error = new Error("Passwords don't match!");
       res.render('signup', { error });
       return;
    }

    const newUser = { firstName, lastName, password, email };
   
   // req.body.sanitized = req.sanitize(req.body.propertyToSanitize);
  // let newUserSanitized = sanitize(newUser);

//     newUser.each( newUser , function(value, key, list){
//     finalUser[key] =  sanitize(value).xss(); 
//     console.log(finalUser);
//  })

    db.User
      .create(newUser, (err, user) => {
        if (err) throw err;
        else {
          res.redirect("/profile");
        }
      });
});

function handleUnexpectedError(err, req, res, next) {

  console.warn('THERE WAS AN UNEXPECTED ERROR');
  res.json({err});
}

app.use(handleUnexpectedError);
app.listen(PORT, () => console.log("🌎 Express app is live on port:", PORT));