const Out = require('../Models/coutFlow')
const In = require('../Models/inflow')
const moment = require('moment-timezone')
const mongoose = require('mongoose')
async function addInflow(req,res,next){
    try {
        
        let inflow = new In();
        inflow.amount = req.body.amount
        inflow.description = req.body.description
        inflow.date = req.body.date
        inflow.user = req.user._id
        await inflow.save()
        res.status(200).send({message:"Ingreso registrado correctamente"})
    } catch (error) {
        console.log(error)
        next(error)
    }
}
async function deleteInflow(req, res, next){
    try {
        let inflow = await In.findById(req.params.id)
        if(inflow){
            await inflow.remove()
            res.status(200).send({
                message:'Ingreso eliminado correctamente'
            })
        }else{
            let err = new Error('No se encontro el ingreso a eliminar')
            err.status = 404 
            next(404)
        }
    } catch (error) {
        next(error)
    }
}
async function addOutFlow(req,res,next){
    try {
        let outflow = new Out()
        outflow.amount = req.body.amount
        outflow.description = req.body.description
        outflow.date = req.body.date
        outflow.user = req.user._id
        await outflow.save()
        res.status(200).send({message:"Egreso registrado correctamente"})
    } catch (error) {
        next(error)
    }
}
async function deleteOutFlow(req, res, next){
    try {
        let outflow = await Out.findById(req.params.id)
        console.log(outflow)
        if(outflow){
            await outflow.remove()
            res.status(200).send({
                message:'Egreso eliminado correctamente'
            })
        }else{
            let err = new Error('No se encontro el egreso a eliminar')
            err.status = 404 
            next(404)
        }
    } catch (error) {
        next(error)
    }
}
async function getIN(req,res,next){
    try {
        let inflows = await In.find({user: req.user._id})
        if(inflows){
            res.status(200).send({inflows})
        }else{
            let err = new Error('No se encontraron ingresos')
            next(err)
        }
    } catch (error) {
        next(error)
    }
}

async function getOUT(req,res,next){
    try {
        let outflows = await Out.find({user: req.user._id})
        if(outflows){
            res.status(200).send({outflows})
        }else{
            let err = new Error('No se encontraron egresos')
            next(err)
        }
    } catch (error) {
        next(error)
    }
}

async function responseTotal(req,res,next){
    try {
        const total = await calculateTotal(req)
        console.log("Total",total)
        res.status(200).send({total})
    } catch (error) {
        console.log(error)
        next(error)
    }
}
async function responseTotalMonth(req,res,next){
    console.log(req.user)
    try {
       const ins = await In.aggregate([
        {
            $match:{ user: mongoose.Types.ObjectId(req.user._id)}
         },
            {$group:{ _id: {year:{$year:"$date"},month: { $month : "$date" }},
             count:{ $sum: "$amount"} ,
              }}
          ])
        const outs = await Out.aggregate([
            {
                $match:{ user: mongoose.Types.ObjectId(req.user._id)}
             },
            {$group:{ _id: {year:{$year:"$date"},month: { $month : "$date" }},
             count:{ $sum: "$amount"} ,
              }}
          ])
        
              res.status(200).send({
                  outs:outs,
                  ins: ins  
                })
          

    } catch (error) {
        next(error)
    }
}
async function totalDay(req,res){
   console.log(req.body.day)
    let day = moment(req.body.day).format("YYYY-MM-DD");
    let finalDay = moment(day).add(1,'days').format("YYYY-MM-DD")

const totalIn = await In.aggregate([
        {
            $match:{date: {"$gte": new Date(day), "$lt": new Date(finalDay)},  user: mongoose.Types.ObjectId(req.user._id)}
        },
        { 
        $group: { 
            _id: null, 
            total: { 
                $sum: "$amount" 
            } 
        } 
    }
    ])
    const totalOut = await Out.aggregate([
        {
            $match:{date: {"$gte": new Date(day), "$lt": new Date(finalDay)},  user: mongoose.Types.ObjectId(req.user._id)}
        },
        { 
        $group: { 
            _id: null, 
            total: { 
                $sum: "$amount" 
            } 
        } 
    }
    ])
    let totalDay
    if(Object.keys(totalIn).length > 0 && Object.keys(totalOut).length > 0 ){   
        totalDay =  (totalIn[0].total - totalOut[0].total)
    }else if(Object.keys(totalIn).length <= 0  && Object.keys(totalOut).length <= 0){
        totalDay =  0
    }else if (Object.keys(totalOut).length <= 0){
        totalDay = totalIn[0].total
    }else if (Object.keys(totalIn).length <= 0){
        totalDay = ( - totalOut[0].total )
    }
    else{
        totalDay = 0
    }
    console.log(totalDay)
    res.status(200).send({totalDay})
}

async function calculateTotal(req){
    const ins = await In.find({user: req.user._id})
    const outs = await Out.find({user: req.user._id})
    console.log("Entradas",ins)
    console.log("Salidas",outs)
    let totalIN = 0
    let totalOut = 0
    
    if(Object.keys(ins).length > 0 && Object.keys(ins).length > 0 ){
        for(element of ins){
            totalIN += element.amount
        }
        for(element of outs){
            totalOut += element.amount
        }
         return (totalIN - totalOut)
    }else if(Object.keys(ins).length > 0 && Object.keys(ins).length <= 0){
        for(element of ins){
            totalIN += element.amount
        }

        return  totalIN
    }else if(Object.keys(ins).length <= 0 && Object.keys(ins).length > 0){
        for(element of outs){
            totalOut += element.amount
        }
        return  -totalOut
    }
    else{
        return 0
    }

}
module.exports = {
    addInflow,
    addOutFlow,
    getIN,
    getOUT,
    responseTotalMonth,
    responseTotal,
    totalDay,
    deleteInflow,
    deleteOutFlow
    
}