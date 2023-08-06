
console.log('------------------------------------------------');
// const sequelize=require('sequelize');
const mon=require('../util/connection');
const bcrpt=require('bcrypt');
const expensemodule=require('../module/expenstable');
const userdetail=require('../module/usertable');
const forgetpass=require('../module/ForgotPasswordRequests');
const authen = require('../middleware/auth');
const session = require('express-session'); 
const uuid=require('uuid');
const jwt=require('jsonwebtoken');
const axios = require('axios');
const path=require('path');
// const { and } = require('sequelize');

console.log("********");
console.log(uuid.v4());
let storeuuid=uuid.v4();
console.log("********");

require('dotenv').config();


function detailencryption(id)// this function through we are encryption aur data with some special keys(secret key)
{
    return jwt.sign({userid:id},'sekreteky');
}

exports.forgetpassword=(async(req,res,next)=>{
    try {
        const data= await userdetail.find({useremailid:req.body.Emaild}); 
        console.log("data",data);
        console.log(data[0].id);
        console.log(data.length);
        const Sib=require('sib-api-v3-sdk');
        const client=Sib.ApiClient.instance

        const apiKey = client.authentications['api-key'];
        apiKey.apiKey =process.env.EMAIL_API_KEY
        console.log('------------------------------------------------');
       
        const tranEmailApi = new Sib.TransactionalEmailsApi();
        
        const sender = {
          email :req.body.Emaild,
        }
        
        const receivers = [
          {
            email :'apsinghrana100@gmail.com',
          },
        ]
        

        if(data.length>0)
        {
            console.log("data found");
            const output =await tranEmailApi.sendTransacEmail({
              sender,
              to: receivers,
              subject: "Reset Password",
              textContent: "Send a reset password mail",
              htmlContent: `<a href="http://localhost:4000/Resetpassword?param1=${storeuuid}">Click here to process</a>`,
            });

            console.log("outpu",output);
              const newdata= new forgetpass({
                id:storeuuid,
                tbluserdetailId:data[0].id,
                isActive:true
              })
  
             await newdata.save();
             return res.status(200).json({message:"Message send successfully",Userid:data[0].id});

        }else{
          console.log("err");
          return res.status(200).json({message:"Email id does not found"});
          // throw "Emailid does not exits!!"
        }

    } catch (error) {
      console.log(error);
      return res.status(400).json({message:error});
    }
});


  exports.checkcreaditialUrl=(async (req,res)=>{
    try {
 
      console.log("hello ajay");
       console.log(req.query.param1)
        const isValidRequestCheck=await forgetpass.findOne({id:req.query.param1});
        console.log(isValidRequestCheck);
        if(isValidRequestCheck.isActive===true)
        {

            forgetpass.findOneAndUpdate({
              isActive:false
            },{id:req.query.param1});
          console.log('i amm forget password');
          
               res.sendFile(path.join(__dirname,'../',`view/resetpasswordform.htm`));
               res.sne
        }else{
         
          console.log("Link is not valid ");
        }
    } catch (error) {
      console.log(error);
  
    }
    console.log("i am reset password calling"+req.query.param1);
    //  res.next();
  })

  exports.updatepassword=(async(req,res)=>{
    console.log("i am updatepassword calling");
    console.log("i am updatepassword calling");
    console.log(req.param.id); 
    console.log("userpass"+req.body.newpass);
    const passowrd= req.body.newpass;
    const saltround=10;
    try {
      bcrpt.hash(passowrd,saltround, async(err,hash)=>{
        const ouput= await  userdetail.findOneAndUpdate({ userpass: hash}, { id: req.params.id } )
        console.log("output"+ouput);
               return res.json(true);
      })
          
  } catch (error) {
    console.log("errpr+"+error);
      return res.json(false);
      
  }

  })