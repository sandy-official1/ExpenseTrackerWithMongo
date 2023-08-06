const mongoose = require("mongoose");
const mongoconnection = require("../util/connection");

const bcrpt = require("bcrypt");
const expensemodule = require("../module/expenstable");
const tbluserdetail = require("../module/usertable");
// const tbldownloadFile=require('../module/downloadfilerecord');
const authen = require("../middleware/auth");

const { json } = require("body-parser");

exports.addexpense = async (req, res, next) => {
  console.log(req.body.expense);
  console.log(req.body.choice);
  console.log(req.body.description);
  console.log("inser" + req.user.id);
  const expensevalue = parseInt(req.body.expense);

  console.log("");
  try {
    const NewExpense = new expensemodule({
      expense: req.body.expense,
      choice: req.body.choice,
      description: req.body.description,
      tbluserdetailId: req.user.id,
    });

    await NewExpense.save();

    await tbluserdetail.updateOne(
      { _id: req.user.id },
      { $inc: { totalexpense: expensevalue } }
    );

    return res
      .status(200)
      .json({
        userid: req.user.id,
        success: true,
        msg: "Data Insert Successfully",
      });
  } catch (error) {
    console.log("somewent wrong in addexpense" + error);
    return res
      .status(400)
      .json({ success: false, msg: "Something Went Wrong" });
  } finally {
    // session.endSession();
  }
};

exports.fetchdata = async (req, res, next) => {
  console.log("i am fetch daling" + req.user.id);
  console.log("i am premi" + req.user.ispremium);

  try {
    const limit_per_page = parseInt(req.query.param2) || 5;
    const pageNumber = parseInt(req.query.param1);
    console.log("pagenumber----------" + pageNumber);
    console.log("rowpersize----------" + req.query.param2);
    const totalitem = expensemodule
      .find({ tbluserdetailId: req.user.id })
      .count()
      .then(async (totalitem) => {
        const expensedata = await expensemodule
          .find({ tbluserdetailId: req.user.id })
          .skip((pageNumber - 1) * limit_per_page)
          .limit(limit_per_page)
          .exec();

        console.log("ddd" + expensedata);
        console.log("data_length" + expensedata.length + "" + expensedata);

        if (
          expensedata.length > 0 &&
          expensedata !== null &&
          expensedata !== undefined
        ) {
          res
            .status(200)
            .json({
              success: true,
              msg: "Record Fetch successfully",
              expensedata,
              ispremiumuser: req.user.ispremium,
              currentPage: pageNumber,
              hasNextPage: limit_per_page * pageNumber < totalitem,
              nextPage: parseInt(pageNumber) + 1,
              hasPreviousPage: pageNumber > 1,
              previousPage: pageNumber - 1,
              lastPage: Math.ceil(totalitem / limit_per_page),
              limit_per_page,
            });
        } else if (expensedata.length === 0) {
          res
            .status(200)
            .json({
              success: false,
              msg: "No Record Found",
              expensedata,
              ispremiumuser: req.user.ispremium,
            });
        }
      });
  } catch (error) {
    res.status(400).json({ success: false, msg: "Something went wrong" });
    throw new Error();
  }
};

exports.deletedata = async (req, res, next) => {
  //where:{id:req.params.id,tbluserdetailId:req.user.id}
  console.log(" i am dele" + req.user.id);
  try {
    console.log(" i am dele" + req.params.id);
    const deletedata = await expensemodule.findByIdAndDelete(req.params.id);
    const reduceExpense = await tbluserdetail.findOneAndUpdate(
      { _id: req.user.id },
      { $inc: { totalexpense: -deletedata.expense } }
    );

    if (deletedata._id.toString() === req.params.id) {
      console.log("data deleted succfully" + deletedata);
      return res
        .status(200)
        .json({ success: true, msg: "data deleted successfully" });
    }
  } catch (error) {
    console.log("something went wrong in delete section" + error);
    return res
      .status(400)
      .json({
        success: false,
        msg: `omething went wrong in delete sections = ${error}`,
      });
  }
};

exports.leaderboarddata = async (req, res) => {
  console.log("show leaderboard is calling");
  try {
    const leaderedata = await tbluserdetail
      .find()
      .sort({ totalexpense: 1 })
      .exec();
    console.log("leadedata", leaderedata.length);
    if (leaderedata.length >= 1) {
      res
        .status(200)
        .json({
          success: true,
          msg: "Record Fetch successfully",
          leaderedata,
          ispremiumuser: req.user.ispremium,
        });
    } else if (leaderedata.length <= 0) {
      res
        .status(401)
        .json({
          success: true,
          msg: "No Record Found",
          leaderedata,
          ispremiumuser: req.user.ispremium,
        });
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, msg: "Something went wrong in showleadboards" });
  }
};

// exports.downloadexpensedataAllFile=(async(req,res)=>{
//     try {
//         const downloadFileData = await tbldownloadFile.findAll({where:{tbluserdetailId:req.user.id}});
//         res.status(200).json({success:true,downloadFileData});
//     } catch (error) {
//         res.status(500).json({success:false,error:error});
//     }

// });

// exports.isPremium=async(req,res)=>{
//     try {
//         const isPremium= await tbluserdetail.findAll({where:{id:req.user.id}});
//         console.log("is----------"+isPremium[0].ispremium);
//         res.json({ispremium:isPremium[0].ispremium});
//     } catch (error) {
//         console.log('something went wrong');
//     }
// }

// exports.downloadexpensedata=async(req,res)=>{

//       const username=req.user.id;
//       try {

//             const userdata= await expensemodule.findAll({where:{tbluserdetailId:req.user.id}});
//             const stingyfyuserdata=JSON.stringify(userdata);
//             const filename=`Expense${username}/${new Date()}.txt`;
//             console.log(userdata);
//             console.log("i am download calling"+stingyfyuserdata);
//             const fileurl= await S3service.uploadS3(stingyfyuserdata, filename);
//             console.log(fileurl);
//             await tbldownloadFile.create({
//                 filename:fileurl,
//                 // expense:"lhjh",
//                 downloaddate:Date(),
//                 tbluserdetailId:req.user.id
//             });
//                 res.status(200).json({fileurl,success:true});

//         } catch (error) {
//             res.status(500).json({fileurl:'',success:false,err:error});
//         }
// };
