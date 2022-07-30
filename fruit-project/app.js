//jshint esversion:6

const { mongoose } = require('mongoose');

//testing

const url = 'mongodb://localhost:27017';

const dbName = 'fruit-db';

// const client = new MongoClient(url);

// client.connect((err) => {
//   assert.equal(null, err);
//   console.log('Connected successfully to server.');

//   const db = client.db(dbName);

//   findDocuments(db, () => {
//     client.close();
//   })
// });

const connectDb = async () => {
  await mongoose.connect(`${url}/${dbName}`);
  console.log('Database successfully connected!');
}

connectDb().catch(error => console.log(error));

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