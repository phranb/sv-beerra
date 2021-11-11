const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const outflowSchema = new Schema({
  description: String,
  type: {
   type : Number,
   required: [true, 'Ingrese el tipo de gasto']
  },
  size: Number,
  quantity: Number,
  month: String,
  price: Number,
  date: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user1'
  }
});

const Outflow = mongoose.model('outflow', outflowSchema);
module.exports = Outflow;