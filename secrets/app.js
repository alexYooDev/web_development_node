const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const { model, Schema } = require('mongoose');

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

  User.findOne({username, password}, (error, result) => {
    if (error) {
      console.log(error);
    } 

    if (result.length !== 0) {
      console.log(`Found User! ${result}`);
    } else {
      console.log('No user found under that email and password');
    }
  })
})

app.listen(PORT, () => {
  console.log('The server is running on the port: ' + PORT)
})