const Payment = require('../Models/payment');
const Keg = require('../Models/keg')
const Out = require('../Models/coutFlow')


async function getPayments(req, res) {
    const pays = await Payment.find({user: req.user._id}).populate('keg')
    if (!pays)
        res.status(404).send({
            message: "No se encontraron pagos"
        })
    res.status(200).send({
        pays
    })

}
async function getPayment(req,res){
    try {
        const payment = await Payment.findById(req.params.idPayment)
        if(Object.keys(payment).length === 0)
            return res.status(404).send({message:'No se encontraron pagos'}); 

        res.status(200).send({payment})     
    } catch (err) {
        res.status(500).send(`${err}`);
    }
   
   
}


async function addPayment(req,res){
    
    try {
        console.log(req.user)
        let payment = new Payment();
        payment.date= req.body.date;
        payment.ammount = req.body.ammount
        payment.keg = req.body.keg
        payment.brewery = req.body.brewery
        payment.user = req.user._id
        const paymentStoraged = await payment.save()

        // registro como gasto de caja
        let outflow = new Out()
        outflow.payment = payment._id
        outflow.amount = payment.ammount
        outflow.description = "Pago de barril a: " + payment.brewery 
        outflow.date = payment.date
        outflow.user = req.user._id
        await outflow.save()

        res.status(200).send({payment:paymentStoraged})
    } catch (err) {

        res.status(500).send(`Error al pagar el barril ${err}`)
    }
}



module.exports = {
    getPayments,
    addPayment,
    getPayment
}