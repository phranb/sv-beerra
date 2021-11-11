
const User = require('../Models/user1')
async function adminUser(req,res,next){
    try {
        
        const user = await User.findOne({username : req.user.username})
        if(user){

            if(user.super === true){
                next()
            }
            else{
                let error = new Error('No tiene acceso al panel administrador')
            error.status = 403
            next(error)
            }

        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}
module.exports = {
    adminUser
}