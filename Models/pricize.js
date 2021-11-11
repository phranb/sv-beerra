const mongoose = require('mongoose')
const Schema = mongoose.Schema

const pricizeSchema = new Schema({
    growlerprice:Number,
    growlerprice2:Number,
    pintprice:Number,
    pintprice2:Number,
    loadprice:Number,
    loadprice2:Number,
    hhourprice:Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user1'
      }
})

const pricize = mongoose.model('pricize',pricizeSchema)
module.exports = pricize