const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {model, Schema} = require('mongoose');
const e = require('express');

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

app
  .route('articles')
  .get( (req, res) => {
    Article.find({}, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send(result);
      }
    });
  })
  .post((req, res) => {
    const { title, content } = req.body;

    const newArticle = new Article({ title, content });

    newArticle.save((error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log(
          'Successfully created and inserted a new article to the collection!'
        );
        res.send(result);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany({}, (error, result) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Successfully deleted all the articles in the collection!');
        res.send(result);
      }
    });
  });

  /* Specific Routing */

  app.route('/articles/:title')
    .get((req, res) => {
      const title = req.params.title;

      Article.findOne({title}, (error, result) => {
        if (error) {
          console.log(error);
        }

        if (result) {
          res.send(result);
        } else {
          console.log('Could not find the specific article');
          res.end();
        }
      })
    })
    .put((req, res) => {
      const title = req.params.title;

      const newTitle = req.body.title;
      const newContent = req.body.content;

      Article.updateOne(
        {title}, 
        {title: newTitle, content: newContent},

        (error, result) => {
        if (error) {
          console.log(error);
        }

        if (result) {
          res.send(result);
        } else {
          console.log('Update failed');
        }
      });
    })
    .patch((req, res) => {

      Article.updateOne(
        {title},
        {$set: req.body},
        (error, result) => {
          if (error) {
            console.log(error)
          }

          if (result) {
            Article.findOne({title: req.body.title}, (error, article) => {
              if (error) {
                console.log(error);
              }

              if (result) {
                res.send(article)
              }
            })
          }
        } 
      )
    })
    .delete((req, res) => {
      const title = req.params.title;

      Article.findOneAndDelete({title}, (error, result) => {
        if (error) {
          console.log(error);
        }

        if (result) {
          res.send(result);
        } else {
          console.log('Could not find requested article.');
        }
      })
    })

app.listen(PORT, () => {
  console.log('Server now listening at port number : 3000');
})

