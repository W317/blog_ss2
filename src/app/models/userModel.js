import mongoose from "mongoose";
import bcrypt from 'bcrypt-nodejs'

import validator from 'validator';

const userSchema = mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email'
    }
  },
  address: {
    type: String,
    require: false,
  },
  phone: {
    type: String,
    require: false,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true
  },
  image: {
    type: String,
    required: false
  },
  username: {
    type: String,
    required: false,
    unique: true
  },
  dayJoined: {
    type: Date,
    default: Date.now
  }
});

userSchema.methods.encryptPassword = function(password) {
  // use 5 rounds of salt creation here
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5));
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const userModel = mongoose.model("userSchema", userSchema);
export default userModel;
