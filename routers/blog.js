const express = require("express");
const router = express.Router();

//import controller

const {sendOtp,signUp,login,verifyOtp,validateUser} = require("../controllers/Auth");
const {createPost,showAllMatches,showOneMatch,createIdPass,announceWinner, myMatches} = require("../controllers/MatchPost");
const {auth} = require("../middlewares/auth");
const {register} =require("../controllers/PlayMatch");
const {suqadEntry} =require("../controllers/SquadUp");
const {playerDetailUpdate,getAllPlayerDetail,getPlayerDetail} = require("../controllers/PlayerDetailController");
const {sendRequest,acceptRequest, rejectRequest,totalRequest,friends} = require("../controllers/RequestAccept");



//for cookie
router.post("/auth",auth,validateUser);
//mapping create
router.post("/sendOtpRouter",sendOtp); //tested     //For sending Otp
router.post("/register",signUp);  //trsted          //For User registeration
router.post("/login",login);  //tested               //For Login
router.get("/getOne/:id",showOneMatch);  //tested   //Get One match details based on id
// router.post("/createPost",createPost);
// router.post("/createPost",auth,createPost,(req,res)=>{
//     res.json({
//         sucess:true,
//         message:"WELCOME TO middlewares"
//     })
// });
router.post("/createPost",auth,createPost); //tested                //Create Match Post
router.get("/getall",showAllMatches); //tested                      //Show ALL matches
router.post("/registerMatch/:id",auth,register); //tested           //Register in match
router.put("/updateSquad",auth,suqadEntry); //tested               //Update Squad entry //post
router.put("/playerdetailupdate",auth,playerDetailUpdate); //tested    //Player Details updates //post
router.get("/getAllPlayer",getAllPlayerDetail); //tested               //Get player details main feature
router.get("/getPlayer/:id",getPlayerDetail); //tested              //get Specific player details
router.post("/createIdPass/:id",auth,createIdPass);                   //Create Custom room id pass
router.post("/announceWinner/:id",auth,announceWinner);             //Announce winner or declare winner

router.post("/send/:id",auth,sendRequest); //tested
router.post("/accept/:id",auth,acceptRequest);//tested
router.post("/reject/:id",auth,rejectRequest);
router.post("/totalRequest",auth,totalRequest);
router.post("/friends",auth,friends);
router.post("/verifyOtp",verifyOtp);

router.get('/myMatches',auth,myMatches);
//exports
module.exports = router;