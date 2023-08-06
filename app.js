const express = require("express");
const session = require("express-session");
const app = express();
const bodyperser = require("body-parser");
const path = require("path");
const mongoose = require("mongoose");
require("./util/connection");

const cors = require("cors");
app.use(cors());
app.use(bodyperser.urlencoded({ extended: true }));
app.use(bodyperser.json());

// this is route(path)
const connection = require("./util/connection");
const routerlogin = require("./router/signupmodule");
const routerexpense = require("./router/expense");
const routepremium = require("./router/premium");
const routepassword = require("./router/password");

// this is all Model(table)
const usertbl = require("./module/usertable");
const expenstbl = require("./module/expenstable");
const order = require("./module/ordertbl");
const forgetpassword = require("./module/ForgotPasswordRequests");
// const downloadmodule=require('./module/downloadfilerecord');

// const authen=require('./middleware/auth');
app.use(routerlogin);
app.use(routerexpense);
app.use(routepremium);
app.use(routepassword);

app.use((req, res, next) => {
  console.log(req.url);
  res.sendFile(path.join(__dirname, `view/${req.url}`));
});

// here relationship between table

// usertbl.hasMany(expenstbl);
// expenstbl.belongsTo(usertbl);
// // usertbl.hasMany(expenstbl, { foreignKey: 'id' });
// // expenstbl.belongsTo(usertbl, { foreignKey: 'tbluserdetailId' });
// usertbl.hasMany(order);
// order.belongsTo(usertbl);

// usertbl.hasMany(forgetpassword);
// forgetpassword.belongsTo(usertbl);

// usertbl.hasMany(downloadmodule);
// downloadmodule.belongsTo(usertbl);

// connection(()=>{
//     console.log("connected");
//     app.listen(process.env.PortNumber || 4000);

// });

// //  console.log( connection.mongoconnection)
// connection
//   .mongoconnection()
//   .then((response) => {
//     if (response) {
//       console.log("connected with database ", response);
//       app.listen(process.env.PortNumber || 4000, () => {
//         console.log("server is connected");
//       });
//     } else {
//       //console.log(resolve, reject);
//       throw new Error("not connected with database");
//     }
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// Connect to MongoDB and start the server
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/ExpenseTracker", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
    app.listen(4000, () => {
      console.log("Server started on port 4000");
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

connectDB();
