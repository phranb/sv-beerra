const Container = require('../Models/container');


async function getContainers(req,res){
    try {
        const Containers = await Container.find({user:req.user._id})

        if(Object.keys(Containers).length === 0)
            return res.status(404).send({message:'No hay envases'}); 
        res.status(200).send({Containers})     
    } catch (err) {
        res.status(500).send(`${err}`);
    }
   
   
}


async function getContainer(req,res){
    try {
        let idContainer = req.params.Container
        const container = await Container.findById(idContainer)

        if(Object.keys(container).length === 0)
            return res.status(404).send({message:'No hay envases'}); 

        res.status(200).send({container})     
    } catch (err) {
        res.status(500).send(`${err}`);
    }
   
   
}
async function addContainer(req,res){
    try {
        
        let container = new Container();
        container.size = req.body.size
        container.stock = req.body.stock
        container.cost = req.body.cost
        container.user = req.user._id
        const containerStoraged = await container.save()
        res.status(200).send({container:containerStoraged})
            
    } catch (err) {

        res.status(500).send(`Error al guardar los envases ${err}`)
    }
}
async function deleteContainer(req,res){
    try {
        let idContainer = req.params.idContainer
        let container = await Container.findById(idContainer)
        if(!container)
            res.status(404).send({mensaje:'Los envases a eliminar no existen'})
         await container.remove()
        res.status(200).send({mensaje:'Envases eliminados correctamente'})

    } catch (err) {
        res.status(500).send({mensaje:`Error al eliminar los envases ${err}`})
    }
}
async function updateContainer(req, res){

    try {
        let idContainer = req.params.idContainer
        let dataContainer = req.body
        let containerUpdated = await Container.findByIdAndUpdate(idContainer, dataContainer)
        
        if(!containerUpdated)
            res.status(404).send('Los envases a actualizar no existen')
        res.status(200).send({
            mensaje:'Envases actualizados correctamente',
            container: dataContainer
        })
    } catch (error) {
        res.status(500).send(`Error al actualizar los envases ${error}`)
    }
  
}
module.exports = {
    getContainer,
    getContainers,
    addContainer,
    deleteContainer,
    updateContainer
}