const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

let items = [];

app.get('/', (req, res) => {
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  };
  let today = new Date().toLocaleDateString('en-US', options);

  res.render('list', { today, items });
});

app.post('/', (req, res) => {
  const { newItem } = req.body;
  items.push(newItem);

  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`the express server is running on port ${PORT}`);
});
