const mongoose = require('mongoose')
const Schema = mongoose.Schema

const otherSchema = new Schema({
    keg: {
        type: Schema.Types.ObjectId,
        ref: 'keg'
      },
    sale:{
        type: Schema.Types.ObjectId,
        ref: 'sale'
    },
    quantity:Number,
    price:Number
})

const other = mongoose.model('other',otherSchema)
module.exports = other