//jshint esversion:6

const { mongoose } = require('mongoose');
const { Schema, model } = require('mongoose');

const url = 'mongodb://localhost:27017';

const dbName = 'fruit-db';


const fruitSchema = new Schema({
  name: String,
  rating: Number,
  review: String,
});

const Fruit = model('Fruit', fruitSchema);

const connectDb = async () => {
  await mongoose.connect(`${url}/${dbName}`);
  console.log('Database successfully connected!');
}

const createDocuments = async (callback) => {

  // Data Schema

  // Creating model

  // const fruit = new Fruit({
  //   name: 'Apple',
  //   rating: 7,
  //   review: 'Great for the start of the day.',
  // });

  // await fruit.save();

  // const personSchema = new Schema({
  //   name: String,
  //   age: Number
  // });

  // const Person = model('Person', personSchema);

  // const person = new Person({
  //   name: 'John',
  //   age: 37
  // })

  // await person.save();

  await callback();
};

const createFruits = async (callback) => {
  const kiwi = new Fruit({
    name: 'Kiwi',
    score: 6,
    review: 'Kinda sour fruit'
  });

  const orange = new Fruit({
    name: 'Orange',
    score: 8,
    review: 'Great for morning juice'
  });

  const banana = new Fruit({
    name: 'Banana',
    score: 5,
    review: 'Decent food supplement'
  });

  Fruit.insertMany([kiwi,orange,banana], (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('successfully added all the fruits to db')
    }
  })
}

const findFruits = async () => {
  await Fruit.find((error, fruits) => {
    if (error) {
      console.log(error);
    } else {
      console.log(fruits);
    }
  })
}

connectDb().catch((error) => {
  console.log(error);
});

findFruits();

// createFruits(() => {
//   console.log('Successfully inserted documents!');
// });



const insertDocuments = async (db, callback) => {
  const collection = db.collection('fruits');

  try {
     const insertedResult = await collection.insertMany([
      {
        name: 'Apple',
        score: 8, 
        review: 'Great fruit'
      },
      {
        name: 'Orange',
        score: 6, 
        review: 'Morning essentials'
      },
      {
        name: 'Banana',
        score: 9,
        review: 'Meal alternatives'
      }
    ]);
    console.log(`${insertedResult.insertedCount} documents were inserted.`);

    callback();

  } catch(e) {
    console.log('Error: Something went wrong!');
  }
}

const findDocuments = async (db, callback) => {
  const collection = db.collection('fruits');

  try {
    const findResult = await collection.find();

    console.log('Found the following records:');
    await findResult.forEach(console.dir);

    callback();

  } catch(e) {

    console.log('An error occured.');

  }
  
}