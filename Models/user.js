const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');


const userSchema = new Schema({
  email: {type:String,lowercase:true},
  displayName: {type: String, required:false},
  password: {type: String,select:false},
  signupDate:{type: Date,default:Date.now},
  lastLogig:Date
});

userSchema.pre('save',(next)=>{
    let user= this;
    //if(!user.isModified('password'))return next()

    bcrypt.genSalt(10,(err,salt)=>{
        if(err) return next()

        bcrypt.hash(user.password,salt,null,(err,hash)=>{
            if (err) return next(err)
            user.password=hash;
            next()
        })
    })

})
module.exports=mongoose.model('User',userSchema);