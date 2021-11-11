const mongoose = require('mongoose')
const Schema = mongoose.Schema

const growlerSchema = new Schema({
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

const growler = mongoose.model('growler',growlerSchema)
module.exports = growler