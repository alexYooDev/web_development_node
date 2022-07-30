//jshint esversion:6

const MongoClient = require('mongodb').MongoClient;

//testing
const assert = require('assert');

const url = 'mongodb://localhost:27017';

const dbName = 'fruit-db';

const client = new MongoClient(url);

client.connect((err) => {
  assert.equal(null, err);
  console.log('Connected successfully to server.');

  const db = client.db(dbName);

  client.close();
});