const mongoose=require('mongoose');
const User = require('../module/usertable');

const order=new mongoose.Schema({
    paymentid:String,
    orderid:String,
    status:String,
    tbluserdetailId : {
        type: mongoose.Schema.ObjectId,
        ref : User,
    }
});

const ordermodule= mongoose.model("order",order)

module.exports=ordermodule;