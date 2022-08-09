require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

/* DB */
const mongoose = require('mongoose');
const { model, Schema } = require('mongoose');
const findOrCreate = require('mongoose-findorcreate');

// const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* session */
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

/* OAUTH 2.0*/
const GoogleStrategy = require('passport-google-oauth20').Strategy;

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
  },
  googleId: String,
  secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

// const SECRET = process.env.secret;

// userSchema.plugin(encrypt, {secret: SECRET, encryptedFields: ['password']});

const User = model('User', userSchema);

/* Google OAUTH */

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/auth/google/secrets'
},
  (accessToken, refreshToken, profile, callback) => {
    User.findOrCreate({ googleId: profile.id }, (error, user) => {
      return callback(error, user);
    })
  }))

passport.use(User.createStrategy());

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (error, user) => {
    done(error, user);
  })
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile']})
);

app.get('/auth/google/secrets', 
  passport.authenticate('google', {failureRedirect: '/login'}),
  (req, res) => {
    res.redirect('/secrets');
  }
)

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
});

app.get('/secrets', (req, res) => {
  User.find({'secret' : {$ne: null}}, (error, users) => {
    
    if (error) {
      console.log(error);
    } else {
      if (users) {
        res.render('secrets', {usersWithSecrets: users});
      }
    }
  })
})

app.get('/submit', (req, res) => {
  if(req.isAuthenticated()) {
    res.render('submit');
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
      });
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

});

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
});

app.post('/submit', (req, res) => {
  const { secret } = req.body;

  User.findOne({ $or: [{googleId: req.user.googleId }, {_id: req.user._id}]}, (error, user) => {
    if (error) {
      console.log(error);
    } else {
      if (user) {
        user.secret = secret;
        user.save(() => {
          res.redirect('/secrets');
        });
      }
    }
  });

})

app.listen(PORT, () => {
  console.log('The server is running on the port: ' + PORT)
})