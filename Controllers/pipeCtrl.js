const Keg = require('../Models/keg');
const Brewery = require('../Models/brewery')

async function getpipes(req,res){
    try {
        const Pipes = await Keg.find({status:3,user:req.user._id}).populate('brewery')

        if(Object.keys(Pipes).length === 0)
            return res.status(404).send({message:'No hay barriles conectados'}); 

        res.status(200).send({Pipes})     
    } catch (err) {
        res.status(500).send(`${err}`);
    }
   
   
}
async function updatePipe(req, res){

    try {
        let idPipe = req.params.idPipe
        let dataPipe = req.body
        let pipeUpdated = await Keg.findByIdAndUpdate(idPipe, dataPipe)
        
        if(!pipeUpdated)
            res.status(404).send('El barril a actualizar no existe')
        res.status(200).send({
            mensaje:'Barril actualizado correctamente',
            pipe: dataPipe
        })
    } catch (error) {
        res.status(500).send(`Error al actualizar barril ${error}`)
    }
  
}
module.exports = {
    getpipes,
    updatePipe
}