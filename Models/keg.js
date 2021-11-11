const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const kegSchema = new Schema({
  beer: {
   type : String,
   required: [true, 'Ingrese el estilo']
  },
  quantity: Number,
  quantitySaled: Number,
  sta: Number,
  ibu: Number,
  alcohol: Number,
  brewery: {
    type: Schema.Types.ObjectId,
    ref: 'brewery'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user1'
  }
});

const Keg = mongoose.model('keg', kegSchema);
module.exports = Keg;