const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs')


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    unique: true,
    trim: true,
    maxlength: [50, 'A Users name should not exceed 50 characters'],
    minlength: [3, 'A Users name should not be less than 3 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //this only works on CREATE and SAVE !!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  passwordChangedAt: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  }
},{
    timestamps: true
});

//pre save middleware to hash password
UserSchema.pre('save', async function(next) {
  //ronly run this fucntion if password was modified
  if(!this.isModified('password')) return next();

  //hash the password 
  this.password = await bcrypt.hash(this.password, 12);

  //delete password confirm field 
  this.passwordConfirm = undefined;
});

UserSchema.pre(/^find/, function(next) {
  //thsi points to the current query
  this.find({ active: { $ne: false } });
  next();
});

//compare password
UserSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

UserSchema.methods.changePasswordAfter = function(JWTimestamp) {
  if(this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    console.log(changedTimestamp, JWTimestamp);
    return JWTimestamp < changedTimestamp;
  }
  return false;
}

module.exports = mongoose.model('User', UserSchema);