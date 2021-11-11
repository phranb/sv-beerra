const Client = require('../Models/client');
const Sale = require('../Models/sale')
async function updateClient(req, res){

    try {
        let idClient = req.params.idClient
        let dataClient = req.body
        let clientUpdated = await Client.findByIdAndUpdate(idClient, dataClient)
        
        if(!clientUpdated)
            res.status(404).send('El gasto a actualizar no existe')
        res.status(200).send({
            mensaje:'gasto actualizado correctamente',
            client: dataClient
        })
    } catch (error) {
        res.status(500).send(`Error al actualizar gasto ${error}`)
    }
  
}

async function deleteClient(req,res, next){
    try {
        let idClient = req.params.idClient
        let saleClient = await verifyClient(idClient)
        if(saleClient){
        let client = await Client.findById(idClient)
        if(!client)
          return  res.status(404).send({mensaje:'Cerveceria a eliminar no existe'})
        await client.remove()
        res.status(200).send({mensaje:'Cerveceria eliminada correctamente'})
        }else{
           let err = new Error('No se puede eliminar el cliente ya que  tiene compras realizadas.') 
           err.status = 422 
           next(err)

        }
    } catch (err) {
        res.status(500).send({mensaje:`Error al eliminar el gasto ${err}`})
    }
}
async function verifyClient(idClient){
    const client = await Sale.find({client:idClient})
    if(Object.keys(client).length != 0){
        return false
    }else{
        return true
    }
}
function createClient(req,res){
    let client = new Client();
    client.name = req.body.name
    client.dni = req.body.dni
    client.tel = req.body.tel
    client.user= req.user._id
    client.save()
        .then((clientStoraged)=>{
            res.status(200).send({client:clientStoraged})
        })
        .catch((err)=>{
            res.status(500).send(`Error al guardar client ${err}`)
        })
        


}

async function getClients(req, res,next){
    try {
        
        const Clients = await Client.find({user: req.user._id})
        if(Object.keys(Clients).length === 0){
            let error = new Error('No existen clientes')
            error.status = 404
            next(error)
        }

            res.status(200).send({Clients});
        
    } catch (error) {
     
            
            next(error)
    }
   
    
}
async function getClient(req, res, next){
    try {
        let idClient = req.params.idClient
        const client = await Client.findById(idClient)
        if(!client){
            let error = new Error('No existe cervezeria a eliminar')
            error.status = 404
            next(error)
        }
        res.status(200).send({client});
    } catch (error) {
        
        next(error)
    }
   
    
}

module.exports = {
    createClient,
    getClients,
    updateClient,
    deleteClient,
    getClient
}