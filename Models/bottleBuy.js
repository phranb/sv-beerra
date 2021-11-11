const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bottleBuySchema = new Schema({
    bottle:{
        type: Schema.Types.ObjectId,
        ref: 'bottle'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user1'
      },
    quantity: Number,
    unityPrice: Number,
    totalPrice: Number,
    date: Date
   
})


const BottleBuy = mongoose.model('bottleBuy', bottleBuySchema);
module.exports = BottleBuy;