const mongoose = require('mongoose')
require('dotenv').config();

const url = process.env.MONGODB_URI

const connectDB = () => {
    return mongoose
      .connect(url, {
        useNewUrlParser: true,
      })
      .then(() => console.log('DB connection successful!'));
} 

  

module.exports = connectDB
