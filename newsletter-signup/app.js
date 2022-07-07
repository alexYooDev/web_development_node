const express = require('express');

const bodyParser = require('body-parser');

const mailchimp = require('@mailchimp/mailchimp_marketing');

const app = express();

const PORT = process.env.PORT || 3000;

/* 정적 파일 경로 설정 */
app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.urlencoded({ extended: true }));

mailchimp.setConfig({
  apiKey: '3a37e461722526efebbdcfbdeacb4251-us12',
  server: 'us12',
});

app.get('/', (req, res, next) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.post('/', (req, res, next) => {
  const { firstname, lastname, email } = req.body;
  const LIST_ID = 'd23e875a6c';

  const subscribingUser = {
    firstName: firstname,
    lastName: lastname,
    email: email,
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(LIST_ID, {
      email_address: subscribingUser.email,
      status: 'subscribed',
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName,
      },
    });
  }

  run()
    .then((response) => {
      res.sendFile(`${__dirname}/success.html`);
      console.log(
        `Successfully added contact as an audience member. The contact's id is ${response.id}.`
      );
    })
    .catch((error) => {
      res.sendFile(`${__dirname}/failure.html`);
    });
});

app.post('/success', (req, res) => {
  res.redirect('/');
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log('The server is running on port 3000');
});
