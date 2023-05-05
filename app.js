const express = require('express');
const app = express();
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
// const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();
const connectDB = require('./db/connect');

const AppError = require('./utils/appError');
// const globalErrorHandler = require('./controllers/errorController');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const orderRouter = require('./routes/order');
const menuRouter = require('./routes/menu');

//middleware
//set security http
app.use(helmet());
app.use(express.json({
  limit: '10kb'
}));

//limit requests from the same ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again in an hour'
})
app.use('/api', limiter);



// Define routes
app.get('/', (req, res) => {
  res.send('Ordering System!!');
});
app.use('/api/v1/user', userRouter);
app.use('/api/v1/menu', menuRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/auth', authRouter);

// //error handling middleware
// app.use(globalErrorHandler);


// app.all('*', (req, res, next) => {
//   next(new AppError(, 404))
// });


//start server
const port = process.env.PORT || 5900

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
};
  
start();
