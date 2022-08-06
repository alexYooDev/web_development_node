const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
const {Schema, model} = require('mongoose');

const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// let items = [];

const dbName = 'todolistDB';
const url = 'mongodb+srv://admin-alex:Free200209!@cluster0.uutaw.mongodb.net/todolistDB';

mongoose.connect(url);

const itemSchema = new Schema({
  name: {
    type: String,
    required: [true, 'No entry specified, please check your data entry.']
  }
})

const Item = model('Item', itemSchema);

const item1 = new Item({
  name: 'buy groceries',
});
const item2 = new Item({
  name: 'have lunch',
});
const item3 = new Item({
  name: 'go for a walk',
});

const defaultItems = [item1, item2, item3];

const listSchema = new Schema({
  name: String,
  items: [itemSchema]
});

const List = model('List', listSchema);

app.get('/', (req, res) => {

  Item.find({},(error, result) => {

    // insert default items only for the first time.
    if (result.length === 0) {

      Item.insertMany(defaultItems, (error) => {
        if (error) {
          console.log(error);
        } else {
          console.log('Successfully stored default items into the collection.');
        }
      });

      res.redirect('/');
    }

    if (error) {
      console.log(error);
    } else {
      res.render('list', { listTitle: 'today', items: result });
    }
  });
});

app.get('/:category', (req,res) => {

  const categoryName = _.capitalize(req.params.category);

  List.findOne({name: categoryName}, (error, result) => {

    if (error) {
      console.log(error);
    } 

    if (result === null) {
      const newList = new List({
        name: categoryName,
        items: defaultItems
      });
      newList.save();
      res.redirect(`/${categoryName}`);
    } else {
      res.render('list', { listTitle: result.name, items: result.items });
    }

  })
}) 

app.get('/about', (req, res) => {
  res.render('about');
});

app.post('/add', (req, res) => {
  const { newItem, list } = req.body;

  const newListItem = new Item({
    name: newItem
  });

  if (list === 'today') {
    newListItem.save();
    res.redirect('/');
  } else {
    List.findOne({name: list},(error, result) => {
      if (error) {
        console.log(error);
      } else {
        result.items.push(newListItem);
        result.save();
        res.redirect(`/${list}`);
        }
      })
  }

});

app.post('/delete', (req, res) => {
  const { deleteItem, listName } = req.body;

  if (listName === 'today') {

    // executes only when provided with a callback as a second parameter
    Item.findByIdAndRemove(deleteItem, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Successfully deleted selected list item : ${deleteItem}`);
        res.redirect('/');
      }
    });
    
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: { items : {_id: deleteItem}}}, (error, result) => {

      if (error) {
        console.log(error);
      } else {
        res.redirect(`/${listName}`);
      }
    })
  }
  
});

app.listen(PORT, () => {
  console.log(`the express server is running on port ${PORT}`);
});
