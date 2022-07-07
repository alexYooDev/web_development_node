const express = require('express');
const bodyParser = require('body-parser');
// const path = require('path');

const app = express();

let result = '';

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res, next) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post('/result', (req, res, next) => {
  let { num1, num2, operator } = req.body;
  switch (operator) {
    case '+':
      result = Number(num1) + Number(num2);
      break;
    case '-':
      result = Number(num1) - Number(num2);
      break;
    case '*':
      result = Number(num1) * Number(num2);
      break;
    case '/':
      result = Number(num1) / Number(num2);
      break;
    default:
      return 'Something Went Wrong!';
  }
  if (isNaN(result)) {
    res.send('You can only type numbers!');
  }
  res.send(`<p>Your Result is ${result}</p>`);
});

app.get('/bmicalculator', (req, res, next) => {
  res.sendFile(`${__dirname}/bmiCalculator.html`);
});

app.post('/bmicalculator', (req, res, next) => {
  const { weight, height } = req.body;
  let bmi = parseFloat(weight) / parseFloat(height) ** 2;
  res.send(`Your BMI is ${bmi}`);
});

app.listen(3000, () => {
  console.log('Server is running at port 3000');
});
