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

app.get('/articles', (req,res) => {

  Article.find({}, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      res.send(result);
    }
  })

})

app.post('/articles', (req,res) => {

  const {title, content} = req.body;

  const newArticle = new Article({title, content});

  newArticle.save((error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Successfully created and inserted a new article to the collection!');
      res.send(result);
    }
  });
});

app.delete('/articles', (req,res) => {
  Article.deleteMany({}, (error, result) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Successfully deleted all the articles in the collection!');
      res.send(result);
    }
  })
})

app.listen(PORT, () => {
  console.log('Server now listening at port number : 3000');
})

