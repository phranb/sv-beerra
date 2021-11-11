const mongoose = require('mongoose')
const Schema = mongoose.Schema

const containerSchema = new Schema({
    size:Number,
    stock:Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user1'
      }
})

const container = mongoose.model('container',containerSchema)
module.exports = container