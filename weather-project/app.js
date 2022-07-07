const express = require('express');
const https = require('https');

const app = express();

app.get('/', (req, res) => {
  const url =
    'https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&appid=0234d99c21d5a3ea55cf9c1ae76d6025';

  https.get(url, (res) => {
    console.log(res.statusCode);
  });

  res.send('server is up and running');
});

app.listen(3000, () => {
  console.log(`server is running on port 3000`);
});
