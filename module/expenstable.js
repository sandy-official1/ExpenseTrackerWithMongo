const Mongoose=require('mongoose');
const connection=require('../util/connection');
const User = require('../module/usertable');


const expenseSchema=new Mongoose.Schema({
    expense:Number,
    choice:String,
    description:String,
    tbluserdetailId : {
        type: Mongoose.Schema.ObjectId,
        ref : User,
    }

});

const expense = Mongoose.model('Expense',expenseSchema)
module.exports=expense;