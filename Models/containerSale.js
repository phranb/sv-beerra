const mongoose = require('mongoose')
const Schema = mongoose.Schema

const containerSaleSchema = new Schema({
    container:{
        type: Schema.Types.ObjectId,
        ref: 'container'
    },
    sale:{
        type: Schema.Types.ObjectId,
        ref:'sale'
    },
    quantitySaled: Number,
    unitPrice: Number,
    totalPrice: Number,
})

const container = mongoose.model('containerSale',containerSaleSchema)
module.exports = container