const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const date = require(`${__dirname}/date.js`);

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));

let items = [];

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
