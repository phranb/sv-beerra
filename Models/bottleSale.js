const mongoose = require('mongoose')
const Schema = mongoose.Schema

const bottleSaleSchema = new Schema({
    bottle:{
        type: Schema.Types.ObjectId,
        ref: 'bottle'
    },
    sale:{
        type: Schema.Types.ObjectId,
        ref:'sale'
    },
    quantitySaled: Number,
    unitPrice: Number,
    totalPrice: Number,
})

const BottleSaleSchema = mongoose.model('bottleSale',bottleSaleSchema)
module.exports = BottleSaleSchema