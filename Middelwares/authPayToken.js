const jwt = require('jsonwebtoken')
const User = require('../Models/user1')
const config = require('../config')
async function checkPayToken(req,res,next){
    try {
        
        const user = await User.findOne({username : req.body.username})
        if(user){
            const token = await jwt.verify(user.payToken, config.TOKEN_SECRET)
            if(token)
                next()

        }else{
            let error = new Error('El usuario ingresado no existe')
            error.status = 404
            next(error)
        }
    } catch (error) {
        console.log(error)
        error.message = "Su pago no ha sido contabilizado es necesario realizar el pago para poder utilizar la aplicacion "
        next(error)
    }
}

module.exports = {
    checkPayToken
}
