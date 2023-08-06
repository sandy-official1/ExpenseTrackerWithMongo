const mongoose =require('mongoose');
// const databasec=require('../util/connection').mongoconnection;



const UserSchema=new mongoose.Schema({
    username :  {
        type :String,
        required: true
    },

    useremailid:{
            type:String,
            required : true,
        },
    userpass:String,

    ispremium:{
        type:Number,
        default :0
     },

     totalexpense:{
        type:Number,
        default :0
    },



});
      const User = mongoose.model('UserDetail', UserSchema);
    module.exports=User;
   

    
    // 'tbluserdetail',{
    // id:{
    //     type:Sequelize.INTEGER,
    //     autoIncrement:true,
    //     allowNull: false,
    //     primaryKey:true
    // },
    // username:Sequelize.STRING,
    // useremailid:{
    //     type:Sequelize.STRING,
    // },
    // userpass:Sequelize.STRING,
    // ispremium:{
    //    type:Sequelize.INTEGER,
    //    defaultValue:0
    // },
    // totalexpense:{
    //     type:Sequelize.BIGINT,
    //     defaultValue:0
    // }


