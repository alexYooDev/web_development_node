require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const { model, Schema } = require('mongoose');
// const md5 = require('md5');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/user-db');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const SECRET = process.env.secret;

// userSchema.plugin(encrypt, {secret: SECRET, encryptedFields: ['password']});

const User = model('User', userSchema);

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, saltRounds, (error, hash) => {

    const newUser = new User({email: username, password: hash});
    
    newUser.save((error) => {
      if (error) {
        console.log(error);
      } else {
        res.render('secrets');
      }
    })
  });

})

app.post('/login', (req, res) => {
  const {username, password} = req.body;

  User.findOne({email: username}, 
  (error, user) => {
    if (error) {
      console.log(error);
    } 

    if (user !== null) {
      bcrypt.compare(password, user.password, (error, result) => {
        if (result === true) {
          res.render('secrets');
        }
      });

    } else {
      console.log('No user found under that email and password');
    }
  });
});

app.listen(PORT, () => {
  console.log('The server is running on the port: ' + PORT)
})