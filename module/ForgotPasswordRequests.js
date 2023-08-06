const mongoose=require('mongoose');
const connection=require('../util/connection');


const forgetPasswordSchema=new mongoose.Schema({
    id:{
        type:String
    },
    isActive :Boolean
})
   
    const forgetPassword = mongoose.model('forgetpassword',forgetPasswordSchema);
    module.exports=forgetPassword;