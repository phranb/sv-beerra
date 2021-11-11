const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pintSchema = new Schema({
    keg: {
        type: Schema.Types.ObjectId,
        ref: 'keg'
    },
    sale:{
        type: Schema.Types.ObjectId,
        ref: 'sale'
    },
    quantity:Number,
    price:Number,

})

const pint = mongoose.model('pint',pintSchema)
module.exports = pint