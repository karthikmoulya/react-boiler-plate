const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/key');

const app = express();

const { User } = require('./models/user');
const { auth } = require('./middleware/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.json({ hello: 'i am happy to deploy our application' });
});

app.get('/api/user/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
  });
});

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

app.post('/api/user/login', (req, res) => {
  //find the email
  User.findOne({ email: req.body.email }, function (err, user) {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      });
    }
    //comparePassword

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({ loginSuccess: false, message: 'wrong password' });
      }
    });

    //generateToken
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      res.cookie('x_auth', user.token).status(200).json({ loginSuccess: true });
    });
  });
});

app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, doc) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).send({ success: true });
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`sever runnig is at port: ${port} `));
