const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const paySchema = new Schema({
    keg: {
        type: Schema.Types.ObjectId,
        ref: 'keg'
    },
    date: Date,
    ammount: Number,
    brewery : String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user1'
      }
});

const Pay = mongoose.model('pay', paySchema);
module.exports = Pay;