const mongoose = require('mongoose');

const MONGOURI = process.env.MONGODB_CONNECT_URL;

const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true
    });
    console.log('Connection to database was succesful.');
  } catch (e) {
    console.log('Database connection unsuccesful: ', e);
    throw e;
  }
};

module.exports = InitiateMongoServer;