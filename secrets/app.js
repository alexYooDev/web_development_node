const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const { model, Schema } = require('mongoose');
const encrypt = require('mongoose-encryption');

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

const secret = 'Thisisourlittlesecret.';

userSchema.plugin(encrypt, {secret, encryptedFields: ['password']});

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

  const newUser = new User({email: username, password});

  newUser.save((error) => {
    if (error) {
      console.log(error);
    } else {
      res.render('secrets');
    }
  })
})

app.post('/login', (req, res) => {
  const {username, password} = req.body;

  User.findOne({ $and: [{username}, {password}]}, (error, result) => {
    if (error) {
      console.log(error);
    } 

    if (result !== null) {
      console.log(result);
      res.render('secrets');
    } else {
      console.log('No user found under that email and password');
    }
  })
})

app.listen(PORT, () => {
  console.log('The server is running on the port: ' + PORT)
})