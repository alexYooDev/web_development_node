require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

/* DB */
const mongoose = require('mongoose');
const { model, Schema } = require('mongoose');

// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* session */
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const e = require('express');
const { authenticate } = require('passport');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

/* session init settings */
app.use(session({
  secret: 'this is my own secret key',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/user-db');

const userSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  }
});

userSchema.plugin(passportLocalMongoose);

// const SECRET = process.env.secret;

// userSchema.plugin(encrypt, {secret: SECRET, encryptedFields: ['password']});

const User = model('User', userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
});

app.get('/secrets', (req, res) => {
  if (req.isAuthenticated()){
    res.render('secrets');
  } else {
    res.redirect('/login');
  }
})

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  User.register({ username }, password, (error, user) => {
    if (error) {
      console.log(error);
      res.redirect('/register');
    } else {
      passport.authenticate('local')(req, res, () => {
        res.redirect('/secrets');
      })
    }
  })

  // bcrypt.hash(password, saltRounds, (error, hash) => {

  //   const newUser = new User({email: username, password: hash});
    
  //   newUser.save((error) => {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       res.render('secrets');
  //     }
  //   })
  // });

})

app.post('/login', (req, res) => {
  const {username, password} = req.body;

  const user = new User({
    username, password
  })

  req.logIn(user, (error) => {
    if (error) {
      console.log(error);
      res.redirect('/login');
    } else {
      passport.authenticate('local')(req,res, () => {
        res.redirect('/secrets');
      });
    }
  })

  // User.findOne({email: username}, 
  // (error, user) => {
  //   if (error) {
  //     console.log(error);
  //   } 

  //   if (user !== null) {
  //     bcrypt.compare(password, user.password, (error, result) => {
  //       if (result === true) {
  //         res.render('secrets');
  //       }
  //     });

  //   } else {
  //     console.log('No user found under that email and password');
  //   }
  // });
});

app.get('/logout', (req, res) => {
  req.logOut((error) => {
    if (error) {
      console.log(error);
    } else {
      res.redirect('/')
    }
  });
})

app.listen(PORT, () => {
  console.log('The server is running on the port: ' + PORT)
})