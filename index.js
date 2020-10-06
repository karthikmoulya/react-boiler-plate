const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const app = express();

const { User } = require('./models/user');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.json({ 'hello ~': 'world ~~~~~' });
});

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, userData) => {
    if (err) return res.json({ success: false, err });
  });
  return res.status(200).json({ success: true });
});

app.listen(5000, () => console.log(`sever runnig is at port: 5000 `));
