const mongoose = require('mongoose')
const Schema = mongoose.Schema

const inflowSchema = new Schema({
    amount: Number,
    description: String,
    date: Date,
    sale: {
        type: Schema.Types.ObjectId,
        ref: 'sale'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user1'
    }
})

const Inflow = mongoose.model('inflow', inflowSchema)
module.exports = Inflow
