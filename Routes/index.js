const express = require('express');
const api = express.Router();
const auth=require('../Middelwares/auth1');
const userCtrl=require('../Controllers/userCtrl');
const payToken = require('../Middelwares/authPayToken')
const admin = require('../Middelwares/adminUser')


api.get('/',auth.checkTocken,(req,res)=>{
    res.send({user: req.user})
});

api.post('/signup',userCtrl.signUp )
api.post('/signin',payToken.checkPayToken,userCtrl.signIn)
api.post('/verify',userCtrl.verify)
api.post('/resetPassword',userCtrl.ResetTokenSendEmail)
api.post('/newPassword/',userCtrl.newPassword)
api.post('/recoverUsername',userCtrl.sendUserName)
api.get('/admin',admin.adminUser,userCtrl.getUsers)
api.post('/payToken/:idUser',admin.adminUser,userCtrl.newPayToken)
api.get('/expired',userCtrl.expired)
/*api.get('/private',auth,function(req,res){
    res.status(200).send({message:'tienes acceso'});
});
api.post('/signin',userCtrl.singIn);
api.post('/signup',userCtrl.singUp);    
*/
module.exports = api;