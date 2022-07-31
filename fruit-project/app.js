//jshint esversion:6

const { mongoose } = require('mongoose');
const { Schema, model } = require('mongoose');

const url = 'mongodb://localhost:27017';

const dbName = 'fruit-db';


const fruitSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please check your data entry, no name specified.']
   },
  score: {
    type: Number,
    min: 1,
    max: 10
  },
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

  const personSchema = new Schema({
    name: String,
    age: Number,
    favoriteFruit: fruitSchema
  });

  const Person = model('Person', personSchema);

  // const peach = new Fruit({
  //   name: 'Peach',
  //   score: 7,
  //   review: 'Pink juicy peach'
  // })

  // peach.save();

  const pineapple = new Fruit({
    name: 'Pineapple',
    score: 10,
    review: 'Tropical gold'
  });
  
  pineapple.save();

  const person = new Person({
    name: 'Harry',
    age: 32,
    favoriteFruit: pineapple
  });

  await person.save();

  await callback();
};

const createFruits = async (callback) => {

  const apple = new Fruit({
    name: 'Apple',
    score: 9,
    review: 'The king of the fruit'
  })

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

  Fruit.insertMany([apple,kiwi,orange,banana], (err) => {
    if (err) {
      console.log(err);
    } else {
      mongoose.connection.close();
      console.log('successfully added all the fruits to db');
    }
  })

  callback();
}

const findFruits = (callback) => {
  Fruit.find((error, fruits) => {
    if (error) {
      console.log(error);
    } else {
      console.log(fruits);
    }
  })

  callback();
}

const logFruitsNames = (callback) => {
  Fruit.find((error, fruits) => {
    if (error) {
      console.log(error);
    } else {
 
      mongoose.connection.close();

      fruits.forEach((fruit) => {
        console.log(fruit.name);
      })
    }
  })
};

const updateFruit = () => {
  Fruit.updateOne({name: 'Orange'}, {name: 'Peach'}, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Successfully updated the document!');
    }
  })
};

const deleteFruit = () => {
  Fruit.deleteOne({name: 'Peach'}, (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Successfully deleted the document!');
    }
  })
};


connectDb().catch((error) => {
  console.log(error);
});

// logFruitsNames();

createDocuments(()=> {
  console.log('Successfully inserted documents!');
});

// deleteFruit();

// updateFruit();

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