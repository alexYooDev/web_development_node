const express = require('express');

const app = express();

app.get('/', (req, res, next) => {
  res.send('<h1>Hello World</h1>');
});

app.get('/contact', (req, res, next) => {
  res.send('Contact me at : alex@gmail.ocm');
});

app.get('/about', (req, res, next) => {
  res.send(`<ul>
    <li>Front-end Developer</li>
    <li>27 years old</li>
    <li>English Major</li>
    <ul>
      skills
      <li>
        HTML
      </li>
      <li>
        CSS
      </li>
      <li>
        JavaScript
      </li>
    </ul>
    </ul>`);
});

app.listen(4000, () => {
  console.log(`server running on port 4000`);
});
