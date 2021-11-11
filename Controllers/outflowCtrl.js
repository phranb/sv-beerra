const Outflow = require('../Models/outflow');
const Container = require('../Models/container');
const BottleBuy = require('../Models/bottleBuy');
const Bottle = require('../Models/bottle');
const Out = require('../Models/coutFlow')

async function getOutflows(req,res){
    try {
        const Outflows = await Outflow.find({user: req.user._id})

        if(Object.keys(Outflows).length === 0)
            return res.status(404).send({message:'No hay gastos'}); 

        res.status(200).send({Outflows})     
    } catch (err) {
        res.status(500).send(`${err}`);
    }
   
   
}

async function getOutflow(req,res){
    try {
        let idOutflow = req.params.idOutflow
        const outflow = await Outflow.findById(idOutflow)

        if(Object.keys(outflow).length === 0)
            return res.status(404).send({message:'No hay gastos'}); 

        res.status(200).send({outflow})     
    } catch (err) {
        res.status(500).send(`${err}`);
    }
   
   
}

async function addOutflow(req,res,next){
    
    try {
        
        let outflow = new Outflow();
        outflow.description = req.body.description
        outflow.quantity = req.body.quantity
        outflow.type = req.body.type
        if (req.body.type === 2) {

           let container = await Container.find({user:req.user._id,"size":req.body.size})
            if(Object.keys(container).length === 0){
                let container = new Container()
                
               container.user = req.user._id
               container.size = req.body.size
               container.stock = req.body.quantity
               console.log(container)
               await container.save()
            }else{
                let container = await Container.findOneAndUpdate({user:req.user._id,"size":req.body.size},{$inc:{stock:req.body.quantity }})
                
            }
            
            
        }
        outflow.price = req.body.price
        outflow.size= req.body.size
        outflow.month = req.body.month
        outflow.date = req.body.date
        outflow.user = req.user._id
        const outflowStoraged = await outflow.save()

        //Registro de gasto 
        let out = new Out()
        out.outflow = outflow._id
        out.amount = await totalOut(outflow)
        out.description = await typeOfdescription(outflow.type)
        out.date = outflow.date
        out.user = req.user._id
        await out.save()

        res.status(200).send({outflow:outflowStoraged})
       
    } catch (err) {
        console.log(err)
            next(err)
    }
}
async function totalOut(outflow){
    if(outflow.type === 5 || outflow.type === 6 || outflow.type === 7 || outflow.type === 3 ){
        return (outflow.price)
    }
    else{
        return (outflow.price * outflow.quantity)
    }
}
async function typeOfdescription(type){
    if(type === 1)
        return "Compras pintas"
    if(type === 2)
        return "Compras botellones"
    if(type === 3)
        return "Compra de limpieza"
    if(type === 4)
        return "Compra de CO2"
    if(type === 5)
        return "Alquiler"
    if(type === 6)
        return "Luz"
    if(type === 7)
        return "Otros"
}
async function addBottleBuy(req,res){
    
    try {
        
        let bottleBuy = new BottleBuy();
        bottleBuy.bottle = req.body.newBottleBuy.bottle
        bottleBuy.quantity = req.body.newBottleBuy.quantity
        bottleBuy.date = req.body.newBottleBuy.date
        bottleBuy.unityPrice = req.body.newBottleBuy.unityPrice
        bottleBuy.totalPrice = req.body.newBottleBuy.totalPrice
        bottleBuy.user = req.user._id
           let bottle = await Bottle.findById(req.body.newBottleBuy.bottle)
           if (!bottle.stock) {
            bottle.stock = bottleBuy.quantity
            
           }else{
            bottle.stock += bottleBuy.quantity
            }
            bottle.price = req.body.newPrice
               await bottle.save()
               await bottleBuy.save()
        res.status(200).send({message : "Botella comprada correctamente"})
       
    } catch (err) {

        res.status(500).send(`Error al guardar el gasto ${err}`)
    }
}
async function deleteOutflow(req,res,next){
    try {
        let idOutflow = req.params.idOutflow
        let outflow = await Outflow.findById(idOutflow)
        if(!outflow){
            let err = new Error("No se encontro el gasto a eliminar") 
            err.status = 404
            next(err)
        }
         await Out.findOneAndDelete({outflow: outflow._id})
         await outflow.remove()
         res.status(200).send({mensaje:'gasto eliminado correctamente'})

    } catch (err) {
        next(err)
    }
}
async function updateOutflow(req, res){

    try {
        let idOutflow = req.params.idOutflow
        let dataOutflow = req.body
        let outflowUpdated = await Outflow.findByIdAndUpdate(idOutflow, dataOutflow)
        
        if(!outflowUpdated)
            res.status(404).send('El gasto a actualizar no existe')
        res.status(200).send({
            mensaje:'gasto actualizado correctamente',
            outflow: dataOutflow
        })
    } catch (error) {
        res.status(500).send(`Error al actualizar gasto ${error}`)
    }
  
}


module.exports = {
    getOutflows,
    getOutflow,
    addOutflow,
    deleteOutflow,
    updateOutflow,
    addBottleBuy,
}