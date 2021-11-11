const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const userSchema = new Schema({
  
  username: {type: String, required:false},
  email: {type: String, required:false},
  password: {type: String,select:false},
  secretToken:String,
  verify: {type: Boolean, default:false},
  resetToken:String,
  payToken: String,
  super: {
    type:Boolean,
    default:false
  }
  
});

const Users = mongoose.model('users', userSchema)

module.exports = Users