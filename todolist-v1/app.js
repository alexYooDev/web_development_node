const express = require('express');
const bodyParser = require('body-parser');
const date = require(`${__dirname}/date.js`);
const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// let items = [];

const dbName = 'todolistDB';
const url = `mongodb://localhost:27017`;

mongoose.connect(`${url}/${dbName}`);

const itemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'No entry specified, please check your data entry.']
  }
})

const Item = model('item', itemSchema);

app.get('/', (req, res) => {
  const today = date.getTodayDate();
  res.render('list', { today, items });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.post('/add', (req, res) => {
  const { newItem } = req.body;
  items.push(newItem);

  res.redirect('/');
});

app.post('/delete', (req, res) => {
  const { deleteItem } = req.body;
  items = items.filter((item) => item !== deleteItem);
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`the express server is running on port ${PORT}`);
});
