const moongose= require('mongoose');
const User=require('../Models/user');
const service = require('../Services/index');

function singUp(req,res){
    const user= new User({
        email:req.body.email,
        displayName:req.body.displayName,
        password:req.body.password
    })
    user.save((err)=>{
        if (err) res.status(500).send({message:`Error al crear el usuario: ${err}` })

        return res.status(200).send({token:service.createToken(user)})

    })
}

function singIn(req,res){   
    User.find({email:req.body.email},(err,user)=>{
        if(err) return res.send(500).send({message: `Error al entrar: ${err}`})
        if(!user) return res.send(404).send({messege: 'No existe el usuario'})

        req.user= user
        res.status(200).send({
            message:'Logueado correctamente',
            token: service.createToken(user)
        })
    })
}

module.exports={singUp,singIn}