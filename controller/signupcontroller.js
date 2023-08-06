// const Sequelize=require('sequelize');
const bcrpt = require("bcrypt");
const usermodule = require("../module/usertable");
const jwt = require("jsonwebtoken");
const mongoconnection = require("mongoose");

exports.addpostdata = async (req, res, next) => {
  try {
    const pass = req.body.password;
    const saltround = 10;
    console.log("i am insert data");
    const count = await usermodule
      .find({ useremailid: req.body.emailid })
      .count();
    // ({where:{useremailid:req.body.emailid}});
    console.log("i am insert data");
    if (count > 0) {
      console.log("email id duplicate");
      return res.json(true);
    } else {
      try {
        bcrpt.hash(pass, saltround, async (err, hash) => {
          const newUser = new usermodule({
            username: req.body.username,
            useremailid: req.body.emailid,
            userpass: hash,
          });
          await newUser.save();
          console.log("User inserted:", newUser);
          return res.json(false);
          // await  usermodule.ins({
          //     username:req.body.username,
          //     useremailid:req.body.emailid,
          //     userpass:hash });
          //     return res.json(false);
        });
      } catch (error) {
        return res.json(true);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

function detailencry(id, username, premium) {
  // this function through we are encryption aur data with some special keys(secret key)
  return jwt.sign(
    { userid: id, username: username, isuserpremium: premium },
    "sekreteky"
  );
}

exports.logincred = async (req, res, next) => {
  console.log("email" + req.body.emailid);
  console.log("password" + req.body.password);
  const passwordtemp = req.body.password;
  const emailtemp = req.body.emailid;
  try {
    const userdetail = await usermodule.findOne({
      useremailid: req.body.emailid,
    });
    console.log("coundt" + userdetail);

    if (userdetail != null) {
      bcrpt.compare(passwordtemp, userdetail.userpass, (err, result) => {
        if (err) {
          console.log("something went wrong");
          // return res.status(401).send({error:"User not authorized!!"});
          throw new Error("User not authorized!!");
        }
        if (result === true) {
          // req.session.user=userdetail;
          return res
            .status(200)
            .json({
              success: true,
              msg: "Login Successfull",
              userdetail: detailencry(
                userdetail.id,
                userdetail.username,
                userdetail.ispremium
              ),
              ispremium: userdetail.ispremium,
            });
          //  res.redirect('/addexpense');
        } else {
          return res.status(401).send({ error: "User not authorized!!" });
        }
      });
    } else {
      return res.status(404).send({ error: "404 - Not Found" });
    }
  } catch (error) {
    console.log(error);
  }
};
