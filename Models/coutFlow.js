const mongoose = require('mongoose')
const Schema = mongoose.Schema

const outflowSchema = new Schema({
    amount: Number,
    description: String,
    date: Date,
    outflow : {
        type: Schema.Types.ObjectId,
        ref: 'outflow'
    },
    payment:{
        type: Schema.Types.ObjectId,
        ref: 'payment'
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user1'
    }
})

const CoutFlow = mongoose.model('coutflow', outflowSchema)
module.exports = CoutFlow
