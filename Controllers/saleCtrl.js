const Sale = require('../Models/sale')
const Growler = require('../Models/growler')
const Pint = require('../Models/pint')
const Other = require('../Models/other')
const Keg = require('../Models/keg')
const Bottle = require('../Models/bottle')
const BottleSale = require('../Models/bottleSale')
const Inflow = require('../Models/inflow')
const Container = require('../Models/container')
const ContainerSale = require('../Models/containerSale')
const format = require('date-format')
const mongoose = require('mongoose')
const moment = require('moment-timezone')

async function createSale(req, res) { 
    try {

        let sale = new Sale()
        sale.client = req.body.client
        sale.totalSale = req.body.totalSale
        sale.date =  moment(req.body.date).tz('America/Argentina/Mendoza')
        sale.user = req.user._id
        let saleStoraged = await sale.save()
        sale._id = saleStoraged._id
        //Guardo productos de la venta
        saleStoraged = saveProducts(req.body.growlers, req.body.bottles, req.body.pints, req.body.others,saleStoraged,req.body.containers)
        
        //Cargo ingreso a la caja
        let inflow = new Inflow();
        inflow.sale = sale._id
        inflow.amount = sale.totalSale
        inflow.description = "Venta cerveza"
        inflow.date = sale.date
        inflow.user = req.user._id
        await inflow.save()

        res.status(200).send({
            message: "Venta realizada correctamente",

        })
    } catch (error) {
        res.status(500).send(`Error al procesar la venta  ${error}`)
    }
} 
async function getGrowler(req,res){
    try {
        let growlers = await Growler.find({"sale":req.params.idSale}).populate('keg')
        if(!growlers)
            res.status(404).send({mensaje:"La venta no tiene growlers"})
        res.status(200).send({growlers})
    } catch (error) {
        res.status(500).send(`Error al buscar la venta  ${error}`)
        console.log(error)
    }
   
}
async function getPint(req,res){
    try {   
        let pints = await Pint.find({"sale":req.params.idSale}).populate('keg')
        if(!pints)
            res.status(404).send({mensaje:"La venta no tiene pintas"})
        res.status(200).send({pints})
    } catch (error) {
        res.status(500).send(`Error al buscar la venta  ${error}`)
        console.log(error)
    }
   
}
async function getOther(req,res){
    try {   
        let others = await Other.find({"sale":req.params.idSale}).populate('keg').populate('others')
        if(!others)
            res.status(404).send({mensaje:"La venta no tiene otros"})
        res.status(200).send({others})
    } catch (error) {
        res.status(500).send(`Error al buscar la venta  ${error}`)
        console.log(error)
    }
   
}
async function getBottle(req,res){
    try {
        let bottles = await BottleSale.find({sale:req.params.idSale}).populate('bottle  ')
        if(!bottles)
            res.status(404).send({mensaje:"La venta no tiene botellas"})
        res.status(200).send({bottles})
    } catch (error) {
        res.status(500).send(`Error al buscar la venta  ${error}`)
        console.log(error)
    }
   
}
async function getContainer(req,res){
    try {
        let containers = await ContainerSale.find({sale:req.params.idSale}).populate('container')
        if(!containers)
            res.status(404).send({mensaje:"La venta no tiene envases"})
        res.status(200).send({containers})
    } catch (error) {
        res.status(500).send(`Error al buscar la venta  ${error}`)
        console.log(error)
    }
   
}
async function saveProducts(growlers, bottles, pints,other, saleStoraged, containers) {

    if (growlers) {
        for (const element of growlers) {
            growler = new Growler()
            growler.keg = element.keg
            growler.quantity = element.quantity
            growler.price = element.price
            growler.sale = saleStoraged._id
            await growler.save()
            await saleStoraged.growlers.push(growler)
            await saleStoraged.save()
            if(saleStoraged){
                let keg = await Keg.findById(element.keg)
                keg.quantitySaled = (keg.quantitySaled - element.quantity)
                await keg.save()
            }
        }
    }
    if (pints) {
        for (const element of pints) {
            let pint = new Pint()
            pint.keg = element.keg
            pint.quantity = element.quantity
            pint.price = element.price
            pint.sale = saleStoraged._id
            await pint.save()
            await saleStoraged.pints.push(pint)
            await saleStoraged.save()
            if(saleStoraged){
                let keg = await Keg.findById(element.keg)
                keg.quantitySaled = (keg.quantitySaled - element.quantity)
                await keg.save()
            }
        }
    }
    if (bottles) {
        for (const element of bottles) {
            let bottle = await Bottle.findById(element._id)
            bottle.stock -= element.quantitySaled
            let bottleSale = new BottleSale()
            bottleSale.bottle = element._id
            bottleSale.sale = saleStoraged._id
            bottleSale.quantitySaled = element.quantitySaled
            bottleSale.unitPrice = element.unitPrice
            bottleSale.totalPrice = element.price
            await bottle.save()
            await bottleSale.save()
            await saleStoraged.bottles.push(bottleSale)
            await saleStoraged.save()
        }
    }
    if(other){
        for(const element of other){
            let other = new Other()
            other.keg = element.keg
            other.quantity = element.quantity
            other.price = element.price
            other.sale = saleStoraged._id
            await other.save()
            await saleStoraged.others.push(other)
            await saleStoraged.save()
            if(saleStoraged){
                let keg = await Keg.findById(element.keg)
                keg.quantitySaled = (keg.quantitySaled - element.quantity)
                await keg.save()
            }
        }
    }
    if (containers) {
        for (const element of containers) {
            let container = await Container.findById(element._id)
            container.stock -= element.quantitySaled
            let containerSale = new ContainerSale()
            containerSale.container = element._id
            containerSale.sale = saleStoraged._id
            containerSale.quantitySaled = element.quantitySaled
            containerSale.totalPrice = element.price
            containerSale.unitPrice = element.cost
            await container.save()
            await containerSale.save()
            await saleStoraged.containers.push(containerSale)
            await saleStoraged.save()
        }
    }
    return saleStoraged;
}

async function getSales(req, res) {
    const sales = await Sale.find({user: req.user._id}).sort({date: -1}).populate('client')
    if (!sales){
        res.status(404).send({
            message: "No se encontraron ventas"
        })}
    res.status(200).send({
        sales
    })

}
async function getSalesofClient(req, res) {
    const Sales = await Sale.find({"client":req.params.idClient}).populate('client').populate('growlers').populate('pints')
    if (!Sales)
        res.status(404).send({
            message: "No se encontraron ventas"
        })
    res.status(200).send({
        Sales
    })
}

async function deleteSale(req,res,next){
 try {
     const sale = await Sale.findById(req.params.idSale)
     if(sale){
        if(Object.keys(sale.growlers).length > 0){
            for(element of sale.growlers ){
                const growler = await Growler.findById(element)
                const keg = await Keg.findById(growler.keg)
                if(keg){
                    keg.quantitySaled += growler.quantity 
                    await keg.save()
                }else{
                    let err = new Error("No se encontro el barril")
                    err.status = 404
                    next(err)
                }
            }
        }
        if(Object.keys(sale.pints).length > 0){
            console.log('Entre en las pintas')
            for(element of sale.pints ){
                const pint = await Pint.findById(element)
                const keg = await Keg.findById(pint.keg)
                if(keg){
                    keg.quantitySaled += pint.quantity 
                    await keg.save()
                }else{
                    let err = new Error("No se encontro el barril")
                    err.status = 404
                    next(err)
                }
            }
        }
        if(Object.keys(sale.others).length > 0){
            for(element of sale.others){
                const other = await Other.findById(element)
                const keg = await Keg.findById(other.keg)
                if(keg){
                    keg.quantitySaled += other.quantity 
                    await keg.save()
                }else{
                    let err = new Error("No se encontro el barril")
                    err.status = 404
                    next(err)
                }
            }
        }
        if(Object.keys(sale.bottles).length > 0){
            for(element of sale.bottles){
                const bottleSale = await BottleSale.findById(element)
                const bottle = await Bottle.findById(bottleSale.bottle)
                if(bottle){
                    bottle.stock += bottleSale.quantitySaled 
                    bottle.save()
                }else{
                    let err = new Error("No se encontro la botella")
                    err.status = 404
                    next(err)
                }
            }
        }
        if(Object.keys(sale.containers).length > 0){
            for(element of sale.containers){
                const containerSale = await ContainerSale.findById(element)
                const container = await Container.findById(containerSale.container)
                if(container){
                    container.stock += element.quantitySaled 
                    container.save()
                }else{
                    let err = new Error("No se encontro la botella")
                    err.status = 404
                    next(err)
                }
            }
        }
        await Inflow.findOneAndDelete({sale: sale._id})
        await sale.remove()
        res.status(202).send({message:'Venta eliminada correctamente'})
     }else{
        let err = new Error("No se encontro la venta a eliminar")
        err.status = 404
        next(err)
     }
 } catch (error) {
     next(error)
 }   
}
// Reportes

async function salesForMonth(req,res,next){
    try {    
        const sales = await Sale.aggregate(
            [   
               
                 
                {
                $match:{
                    user: mongoose.Types.ObjectId(req.user._id)
                    }
              },
                {
                $group: {
                  _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                       count : { $sum : 1 }
                  }
                },
                {
                    $sort: { "_id.month": 1}
                }
            ]
        )
        if(sales){
            res.status(200).send({sales})
        }
    } catch (error) {
       next(error)  
    }
}

async function TypesForMonth(req,res,next){
    try {    
        const sales = await Sale.aggregate(
           [
             {
                $match:{ user: mongoose.Types.ObjectId(req.user._id)}
             },
             {
                  $group: {
                           _id : { year: { $year : "$date" }, month: { $month : "$date" }}, 
                           growlers:{$sum: {$size :"$growlers"}},
                           pints:{$sum: {$size :"$pints"}},
                           others:{$sum: {$size :"$others"}},
                           bottles:{$sum: {$size :"$bottles"}},
                          }
             },
             {
                $sort: { "_id.month": 1}
            }
           ]
        )
        if(sales){
            res.status(200).send({sales})
        }
    } catch (error) {
       next(error)  
    }
}


async function prueba(req,res,next){
    const growlers = await Sale.aggregate(     [
        {
            $match:{ user: mongoose.Types.ObjectId(req.user._id)}
         },
        {
           $lookup: {
               from: "growlers",
               localField: "growlers",
               foreignField: "_id",
               as: "growlers"
           }
       },
      
       {$unwind: {path:"$growlers",
       preserveNullAndEmptyArrays: true}
       
   },
   

{
       $group:{ _id: {year:{$year:"$date"},month: { $month : "$date" }},
       count:{ $sum: {
           $add: [
         
               { $ifNull: ["$growlers.quantity", 0] }
           ]      
       }} ,
       
       
       
       
   }},

  
   

{
   $sort: { "_id.month": 1}
}
])

 const pints = await Sale.aggregate([
    {
        $match:{ user: mongoose.Types.ObjectId(req.user._id)}
     },
    {
       $lookup: {
           from: "pints",
           localField: "pints",
           foreignField: "_id",
           as: "pints"
       }
   },
  
   {$unwind: {path:"$pints",
   preserveNullAndEmptyArrays: true}
   
},


{
   $group:{ _id: {year:{$year:"$date"},month: { $month : "$date" }},
   count:{ $sum: {
       $add: [
     
           { $ifNull: ["$pints.quantity", 0] }
       ]      
   }} ,
   
   
   
   
}}])

const others = await Sale.aggregate([
    {
        $match:{ user: mongoose.Types.ObjectId(req.user._id)}
     },
    {
       $lookup: {
           from: "others",
           localField: "others",
           foreignField: "_id",
           as: "others"
       }
   },
  
   {$unwind: {path:"$others",
   preserveNullAndEmptyArrays: true}
   
},


{
   $group:{ _id: {year:{$year:"$date"},month: { $month : "$date" }},
   count:{ $sum: {
       $add: [
     
           { $ifNull: ["$others.quantity", 0] }
       ]      
   }} ,
   
   
   
   
}},])

res.status(200).send({
    growlers,
    pints,
    others
})
}

async function sumLitres (growlers,pints,others){
    let total = []


}
async function litresForMonth(req,res,next){
    try {
        
        
        const sales = await Sale.aggregate(
            [
                {
                    $match: { user: mongoose.Types.ObjectId(req.user._id)}
                },
                
                
                {
                    $lookup: {
                        from: "others",
                        localField: "others",
                        foreignField: "_id",
                        as: "others"
                    }
                },
                {$unwind: {path:"$others",
                preserveNullAndEmptyArrays: true}   
            },
            {
                $lookup: {
                    from: "pints",
                    localField: "pints",
                    foreignField: "_id",
                    as: "pints"
                }
            },
            {$unwind: {path:"$pints",
            preserveNullAndEmptyArrays: true}
        },
        
        {
            $lookup: {
                from: "growlers",
                localField: "growlers",
                foreignField: "_id",
                as: "growlers"
            }
        },
        {$unwind: {path:"$growlers",
        preserveNullAndEmptyArrays: true}
    },
    
    
    {
        $group:{ _id: {year:{$year:"$date"},month: { $month : "$date" }},
        count:{ $sum: {
            $add: [
                { $ifNull: ["$pints.quantity", 0] },
                { $ifNull: ["$others.quantity", 0] },
                { $ifNull: ["$growlers.quantity", 0] }
            ]      
        }} ,
        
        
    }
},

{
    $sort: { "_id.month": 1}
}

]
)

if(sales){
    res.status(200).send({sales})
}
} catch (error) {
    next(error)
}


    }
async function litresForBrewery(req, res, next){
    const pints = await Sale.aggregate([
        {
            $match:{ user: mongoose.Types.ObjectId(req.user._id)}
         },
        {$unwind: {path:"$pints",
       preserveNullAndEmptyArrays: true}
   },
        {
           $lookup: {
               from: "pints",
               localField: "pints",
               foreignField: "_id",
               as: "resultPints"
           }
       },
      
       {$unwind: {path:"$resultPints",
       preserveNullAndEmptyArrays: true}
       
   },
        {
           $lookup: {
               from: "kegs",
               localField: "resultPints.keg",
               foreignField: "_id",
               as: "kegs"
           }
       },
       
       
       {$unwind: {path:"$kegs",
       preserveNullAndEmptyArrays: true}
       
   },
     {
           $lookup: {
               from: "breweries",
               localField: "kegs.brewery",
               foreignField: "_id",
               as: "brewery"
           }
       },   
      
           {
       $group:{ _id: "$brewery.name",
       count:{ $sum: {
           $add: [
         
               { $ifNull: ["$resultPints.quantity", 0] }
           ]      
       }} ,
       
       
       
       
   }}
        
])
const growlers = await Sale.aggregate([
    {
        $match:{ user: mongoose.Types.ObjectId(req.user._id)}
     },
    {$unwind: {path:"$growlers",
   preserveNullAndEmptyArrays: true}
},
    {
       $lookup: {
           from: "growlers",
           localField: "growlers",
           foreignField: "_id",
           as: "resultGrowlers"
       }
   },
  
   {$unwind: {path:"$resultGrowlers",
   preserveNullAndEmptyArrays: true}
   
},
    {
       $lookup: {
           from: "kegs",
           localField: "resultGrowlers.keg",
           foreignField: "_id",
           as: "kegs"
       }
   },
   
   
   {$unwind: {path:"$kegs",
   preserveNullAndEmptyArrays: true}
   
},
 {
       $lookup: {
           from: "breweries",
           localField: "kegs.brewery",
           foreignField: "_id",
           as: "brewery"
       }
   },   
  
       {
   $group:{ _id: "$brewery.name",
   count:{ $sum: {
       $add: [
     
           { $ifNull: ["$resultGrowlers.quantity", 0] }
       ]      
   }} ,
   
   
   
   
}}
    
])
const others = await Sale.aggregate([
    {
        $match:{ user: mongoose.Types.ObjectId(req.user._id)}
     },
    {$unwind: {path:"$others",
   preserveNullAndEmptyArrays: true}
},
    {
       $lookup: {
           from: "others",
           localField: "others",
           foreignField: "_id",
           as: "resultOthers"
       }
   },
  
   {$unwind: {path:"$resultOthers",
   preserveNullAndEmptyArrays: true}
   
},
    {
       $lookup: {
           from: "kegs",
           localField: "resultOthers.keg",
           foreignField: "_id",
           as: "kegs"
       }
   },
   
   
   {$unwind: {path:"$kegs",
   preserveNullAndEmptyArrays: true}
   
},
 {
       $lookup: {
           from: "breweries",
           localField: "kegs.brewery",
           foreignField: "_id",
           as: "brewery"
       }
   },   
  
       {
   $group:{ _id: "$brewery.name",
   count:{ $sum: {
       $add: [
     
           { $ifNull: ["$resultOthers.quantity", 0] }
       ]      
   }} ,
   
   
   
   
}}
    
])
    res.status(200).send({pints,growlers,others})

}

async function totalSales(req,res){
   
    let day = moment(req.body.day).format("YYYY-MM-DD");
    let finalDay = moment(day).add(1,'days').format("YYYY-MM-DD")

console.log(day)
console.log(finalDay)
    
    const totalSale = await Sale.aggregate([
        {
           
            $match:{date: {"$gte": new Date(day), "$lt": new Date(finalDay)},  user: mongoose.Types.ObjectId(req.user._id)}
        },
        { 
        $group: { 
            _id: null, 
            total: { 
                $sum: "$totalSale" 
            } 
        } 
    }
    ])
    
    if(totalSale){
        res.status(200).send({
            total:totalSale[0].total
        })
    }
}
    module.exports = {
        createSale,
        deleteSale,
        getSales,
        getGrowler,
        getPint,
        getBottle,
        getOther,
        getContainer,
        salesForMonth,
        TypesForMonth,
        litresForMonth,
        getSalesofClient,
        prueba,
        litresForBrewery,
        totalSales

    }


   