const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');
const e = require('express');

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

const Item = model('Item', itemSchema);

const item1 = new Item({
  name: 'buy groceries'
});
const item2 = new Item({
  name: 'have lunch',
});
const item3 = new Item({
  name: 'go for a walk',
});

const defaultItems = [item1, item2, item3];

// Item.insertMany(defaultItems, (error) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Successfully stored default items into the collection.')
//   }
// });

app.get('/', (req, res) => {

  Item.find({},(error, result) => {
    if (error) {
      console.log(error)
    } else {
      res.render('list', { today: 'today', items: result });
    }
  });
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
