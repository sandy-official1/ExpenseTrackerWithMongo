const jwt=require('jsonwebtoken');
const usermoderl=require('../module/usertable');

const authenticate=((req,res,next)=>{
    try {
        const token=req.header('Authorization');
        console.log(token);
        const user=jwt.verify(token,'sekreteky');
        console.log(user.userid);
        usermoderl.findOne({_id:user.userid}).then(user=>{
            // console.log(JSON.stringify(user.username));
            // console.log(user);
            req.user=user;
            console.log("-----------------------"+req.user.username);
            next();
        }).catch(err=>{
            console.log(err);
        });
    } catch (error) {
        console.log(error);
        return res.status(401).json({success:false});
        
    }
});

// const authenticatecheckpremium=((req,res,next)=>{
//     try {
//         const token=req.header('Authorization');
//         console.log(token);
//         const user=jwt.verify(token,'sekreteky');
//         console.log(user.isuserpremium);
//         usermoderl.findAll({where:}).then(user=>{
//             // console.log(JSON.stringify(user.username));
//             // console.log(user);
//             req.user=user;
//             next();
//         }).catch(err=>{
//             console.log(err);
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({success:false});
        
//     }
// });
module.exports={authenticate};