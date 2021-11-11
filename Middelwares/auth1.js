const jwt = require('jsonwebtoken')
const config = require('../config')

async function checkTocken(req, res, next){
    const authHeader = req.get('authorization')
    try {
        
        if(authHeader){
        
            const token = authHeader.split(' ')[1]
            if(token){
                const user = await jwt.verify(token, config.TOKEN_SECRET)
             
                if(user){
                    req.user = user    
                    next()
                }else{      
                    next()
                }
            }else{     
                next()
            }
        }else{  
            next()
        }
    } catch (error) {
        error.status=401
        error.message = "El token expiro inicie secion nuevamente"
        next(error)
    }
    
}
async function isLoggedIN(req, res, next){
    if(req.user){
        
        next()
    }else{
        const error = new Error('No tiene acceso 🚫')
        error.status = 401
        next(error)
    }
}
module.exports ={
    checkTocken,
    isLoggedIN
}