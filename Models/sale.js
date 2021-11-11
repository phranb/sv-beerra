const mongoose = require('mongoose')
const Schema = mongoose.Schema

    
const saleSchema = new Schema({
    client:{
       
        type: Schema.Types.ObjectId,
        ref:'client'
        
    },  
    growlers:[{
       
        type: Schema.Types.ObjectId,
        ref:'growler'
        
    }],  
    pints:[{
       
        type: Schema.Types.ObjectId,
        ref:'pint'
        
    }],  
    bottles:[{
       
        type: Schema.Types.ObjectId,
        ref:'bottleSale'
        
    }],
    others:[{
        type: Schema.Types.ObjectId,
        ref:'other'
    }],
    containers:[{
        type: Schema.Types.ObjectId,
        ref:'containerSale'
    }],
    date:Date,
    totalSale:Number,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user1'
    }
})


const Sale = mongoose.model('sale',saleSchema)
module.exports = Sale