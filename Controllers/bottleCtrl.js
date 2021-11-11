const Bottle = require('../Models/bottle');
const Brewery = require('../Models/brewery')
const BottleBuy = require('../Models/bottleBuy')
const BottleSale = require('../Models/bottleSale')
async function getBottles(req,res){
    try {
        console.log(req.user._id)
        const bottles = await Bottle.find({user: req.user._id}).populate('brewery')
        if(!bottles)
            return res.status(404).send({message:'No hay botellas'}); 

        res.status(200).send({bottles})     
    } catch (err) {
        res.status(500).send(`${err}`);
    }
   
   
}
async function getBottle(req,res){
    try {
        const bottle = await Bottle.findById(req.params.idBottle)
    if(!bottle)
        res.status(404).send({message:"No se encontro la botella "})
    res.status(200).send({bottle})
    } catch (error) {
        res.status(500).send(`Error al buscar botella ${err}`)
    }
    
}

async function getBottlebuys(req,res){
    try {
        BottleBuy
        .find({user:req.user._id})
            .populate({
	            path:     'bottle',			
                populate: { path:  'brewery', 
                            model: 'brewery' }          
            })
        .exec(function(err, data){
            if (err) console.log(err);
            const BottleBuys = data
            if(Object.keys(BottleBuys).length === 0)
            return res.status(404).send({message:'No hay gastos'}); 

        res.status(200).send({BottleBuys}) 
        });
        
    } catch (err) {
        console.log(err)
        res.status(500).send(`${err}`);
    }
   
}
async function createBottle(req,res,next){
    
    try {

        let bottle = new Bottle();
        bottle.beer = req.body.beer;
        bottle.size = req.body.size;
        bottle.ibu = req.body.ibu;
        bottle.alcohol = req.body.alcohol;
        bottle.brewery = req.body.brewery;
       
        bottle.user = req.user._id
        const bottleStoraged = await bottle.save()
        res.status(200).send({message:"Botella creada correctamente"})
            
    } catch (err) {

       next(err)
    }
}
async function deleteBottle(req,res,next){
    try {
        let idBottle = req.params.idBottle
        let bottleSaled = await verifyBottle(idBottle)

        if(bottleSaled){
            let bottle = await Bottle.findById(idBottle)
            if(bottle){
            await bottle.remove()
            res.status(200).send({mensaje:'Botella(s) eliminada(s) correctamente'})
            }
        }else{
            console.log("aca entre")
            let err = new Error('No es posible eliminar esta bottella ya que tiene ventas')
            
            next(err)
        }
    } catch (err) {
        res.status(500).send({mensaje:`Error al eliminar la(s) botella(s) ${err}`})
    }
}
async function verifyBottle(idBottle){
    const bottleSale = await BottleSale.find({bottle: idBottle})
    const bottleBuy =  await BottleBuy.find({bottle: idBottle})
    if(Object.keys(bottleSale).length != 0){
        console.log('venta',Object.keys(bottleSale).length)
 
        return false
    }else if (Object.keys(bottleBuy).length != 0){
        console.log('compra',Object.keys(bottleBuy).length)
        return false
    }else{
        return true
    }
}
async function updateBottle(req, res){

    try {
        let idBottle = req.params.idBottle
        let dataBottle = req.body
        let bottleUpdated = await Bottle.findByIdAndUpdate(idBottle, dataBottle)
        
        if(!bottleUpdated)
            res.status(404).send('La(s) botellas(s) a actualizar no existe(n)')
        res.status(200).send({
            mensaje:'Botella(s) actualizada(s) correctamente',
            bottle: dataBottle
        })
    } catch (error) {
        res.status(500).send(`Error al actualizar la botella ${error}`)
    }
  
}
module.exports = {
    getBottles,
    createBottle,
    deleteBottle,
    updateBottle,
    getBottle,
    getBottlebuys
}