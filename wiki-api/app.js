const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {model, Schema} = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('public'));

const url = 'mongodb://localhost:27017';
const dbName = 'wiki-db';

mongoose.connect(`${url}/${dbName}`);

const articleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
});

const Article = model('article', articleSchema);

app.get('/', (req,res) => {

  Article.find({}, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
    }
  })

})

app.listen(PORT, () => {
  console.log('Server now listening at port number : 3000');
})

