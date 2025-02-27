const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const connection = () =>
  mongoose
    .connect(process.env.CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected To MongoDB!!'))
    .catch((e) => console.log('Mongoose Error: ' + e));

module.exports = connection;
