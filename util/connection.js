module.exports = {
  mongoURI: "mongodb://127.0.0.1:27017/ExpenseTracker",
};

// const mongoose = require("mongoose");

// exports.mongoconnection = async () => {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/ExpenseTracker", {
//       // useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("Connected to MongoDB");
//     return true;
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error.message);
//     return false;
//   }
// };

// const mongoconnection = () => {
//   return new Promise((resolve, reject) => {
//     mongoose.connect("mongodb://localhost:27017/ExpenseTracker", {
//       // useNewUrlParser: true,
//       // useFindAndModify: false,
//       useUnifiedTopology: true,
//     })
//     .then(() => {
//       console.log("Connected to MongoDB successfully!");
//       resolve(); // Resolve the promise without any value (optional)
//     })
//     .catch(error => {
//       console.error("MongoDB connection error:", error);
//       reject(error); // Reject the promise with the error (optional)
//     });
//   });
// };

// let _db;
// const mongoConnect= (callback) =>{
//     console.log("hello");
//     MongoClient.connect('mongodb+srv://apsinghrana100:Gp2A1rBREFXn7t6Q@cluster0.d6mdtgb.mongodb.net/ecommerce?retryWrites=true&w=majority')

// .then(client=>{
//     console.log(client);
//     console.log("connected successfully")
//     _db=client.db();
//     callback();
// })
// .catch(error=>{
//     console.log("Database"+error);
// });
// }

// throw Error;

// }

//  module.exports=mongoconnection;
