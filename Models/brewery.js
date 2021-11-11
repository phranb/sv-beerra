const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const brewerySchema = new Schema({
  name: String,
  address:String,
  contact: [{
    name: String,
    tel: Number,
    mail: String
  }],
  user:{
    type:Schema.Types.ObjectId,
    ref:'user1'
  }

});

const Brewery = mongoose.model('brewery', brewerySchema);
module.exports = Brewery;