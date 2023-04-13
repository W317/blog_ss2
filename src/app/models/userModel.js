import mongoose from "mongoose";
import bcrypt from 'bcrypt-nodejs'

const userSchema = mongoose.Schema({
  name: {
      type: String,
      required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true
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
