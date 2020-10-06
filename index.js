const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose
  .connect(
    'mongodb+srv://karthik:karthik123@cluster0.id5pt.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('DB connected'))
  .catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('hello world');
});

app.listen(5000, () => console.log(`sever runnig is at port: 5000 `));