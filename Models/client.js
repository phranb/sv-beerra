const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  name: String,
  dni:Number,
  tel:Number,
  user:{
    type:Schema.Types.ObjectId,
    ref:'user1'
  }
});

const Client = mongoose.model('client', clientSchema);
module.exports = Client;