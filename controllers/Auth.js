const USER = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const PLAYER_DETAIL = require("../models/PlayerDetail");
const STATISTIC = require("../models/Statistic");
const SQUAD = require("../models/Squad");
const GAME_PLAYED = require("../models/GamePlayed");
const SENDER = require("../models/Sender");
const RECIEVER = require("../models/Request");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const cookie = require("cookie");



// Send otp
//sucess fully tested
exports.sendOtp = async(req,res) =>{
    try{
        //fetch email from requiest body
        const {email} =req.body;


        if(!email){
            return res.status(401).json({
                success : false,
                message : "PLEASE PROVIDE email",
            })
        }

        //check if user already exist
        const checkUserPresent = await USER.findOne({email});

        // if User already Exist , then return a respone //check once again for !checkuserPresent
        if(checkUserPresent){
            return res.status(401).json({
                success : false,
                message : "User already exist"
            })
        }
         
        //generate otp 
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars : false,
        });
        console.log("OTP generated : ",otp);

        const otpPayload = {email,otp};

        //create an entry for otp
        const otpbody = await OTP.create(otpPayload);
        console.log(otpbody);

        //return response successful
        res.status(200).json({
            succes : true,
            message : "OTP SENT successfully",
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : error.message,

        })
    }
}


//signup
//sucessfully tested
exports.signUp = async(req,res)=>{
    try{
        //data fetch from request body
        const{
            email,
            password,
            confirmPassword,
            user_id,
            game_id,
            ingame_name,
            // otp,

        } = req.body;
        //validate it
        if(!email || !password || !confirmPassword || !user_id || !game_id || !ingame_name){
            return res.status(403).json({
                success :false,
                message : "ALL FIELDS ARE REQUIRED",
            })
        }
        //2 password match
        if(password!==confirmPassword){
            return res.status(400).json({
                success :false,
                message : "Password and confirm password Does Not match_date",
            });
        }
        //check user already exist or not
        const existingUser = await USER.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success :false,
                message : "User Already Exist",
            })
        }

        //check User name already exist
        const existingUser_id = await USER.findOne({user_id});
        if(existingUser){
            return res.status(400).json({
                success :false,
                message : "User_id Already Exist Try different",
            })
        }

        //find most recent otp stored for the user
        const recentOtp = await OTP.find({email}).sort({createAt:-1}).limit(1);
        
        // console.log("RECENT OTP RESPONSE ",recentOtp ,"\nOUR OTP : ",otp ,"\nDB OTP : ",recentOtp[0].otp);

        //validate otp
        // if(recentOtp.length==0){
        //     return res.status(400).json({
        //         success :false,
        //         message : "Otp NOT Found",
        //     })
        // }
        // else if(otp!==recentOtp[0].otp){
        //     return res.status(400).json({
        //         success :false,
        //         message : "Invalid otp",
        //     })
        // }

        //hash password
        const hasedPassword = await bcrypt.hash(password,10);

        //create entry in db
        const PlayerDetail = await PLAYER_DETAIL.create({
            matches_played: 0,
            kill : 0,
            total_win : 0,
            kd : 1,
        })
        //statistic
        const statistic = await STATISTIC.create({
            // user_obj_id : 
            total_matches:0,
            win : 0,
        })
        //squad
        const squad = await SQUAD.create({
            //might cause error due to  id has null 
            player1_id : "0",
            player1_name:"",
            player2_id:"0",
            player2_name:"",
            player3_id:"0",
            player3_name:"",
        })

        //GamePlayed
        const gameplayed = await GAME_PLAYED.create({
            matches_played : [],
        })

        //sender
        const sender = await SENDER.create({
            sender : [],
        })


        //receiever
        const receiver = await RECIEVER.create({
            request : [],
        })

        //create entry for db
        const user = await USER.create({
            //check for syntax i this this is like only putting email ,password,user_id etc
            email : email,
            password : hasedPassword,
            user_id : user_id,
            game_id : game_id,
            ingame_name : ingame_name,
            playerdetail : PlayerDetail._id,
            statistic : statistic._id,
            squad : squad._id,
            request : receiver._id,
            send : sender._id,
            image : `https://api.dicebear.com/5.x/initials/svg?seed=${ingame_name}`,
            in_game_name : ingame_name
        })

        //add object id
        await STATISTIC.findOneAndUpdate({_id:statistic._id},{$set : {user_obj_id:user._id}});
        await SQUAD.findOneAndUpdate({_id:squad._id},{$set : {user_obj_id:user._id}});
        await PLAYER_DETAIL.findOneAndUpdate({_id:PlayerDetail._id},{$set : {user_obj_id:user._id}});
        await GAME_PLAYED.findOneAndUpdate({_id:gameplayed._id},{$set : {user_obj_id:user._id}});
        await SENDER.findOneAndUpdate({_id:sender._id},{$set : {user_obj_id:user._id}});
        await RECIEVER.findOneAndUpdate({_id:receiver._id},{$set : {user_obj_id:user._id}});
        
        //return response
        res.status(200).json({
            success :true,
            message :`USER IS REGISTERD SUCCESSFULLY`,
            user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while registering",
        })
    }

    // testing purpose
    // {
    //     "email" : "noboratorgaming@gmail.com",
    //     "password" : "NOBORATOR",
    //     "confirmPassword" : "NOBORATOR",
    //     "user_id" : 123,
    //     "game_id" : 446262751,
    //     "ingame_name" : "NOBORATOR",
    //     "otp" : 664313
    
    // }
    
};


//login
exports.login = async(req,res) => {
    try{
        //get data from req body
        
        const {email,password} = req.body;
        console.log(email,password);

        // valudation data
        // console.log("LOGGING ....");
        if(!email || !password){
            return res.status(403).json({
                success : false,
                message : "ALL FIELDS ARE REQUIRED",
            });
        }
        //user check exist or not
        const user  = await USER.findOne({email});
        if(!user){
            return res.status(403).json({
                success : false,
                message : "USER DOESNOT EXIST",
            });
        }
        //generate JWT , after password matching

        if(bcrypt.compare(password,user.password)){
            const payload = {
                email : user.email,
                id : user._id,
            }
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn : "4d",
            });
            user.token = token;
            user.password = null;

            //create cookie and send response
            const option = {
                expires : new Date(Date.now() + 3*24*60*60*1000),
                httpOnly :true,
                secure:true,
                sameSite : 'none',
            }
            req.user = user;//justy added and testing
            console.log(req);
            res.cookie("token",token,option).status(200).json({
                success:true,
                token,
                user,
                message : "Logged in successfully",
            })
        }
        else{
            return res.status(401).json({
                success : false,
                message :"Password is incorrect",
            });
        }



    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : " LOGIN FAILED PLEASE TRY AGAiN",
        })
    }
}


//verifiy otp
exports.verifyOtp = async(req,res)=>{
    try{
        //data fetch from request body
        const{
            email,
            otp,

        } = req.body;
        console.log("____________ " ,typeof(otp))
        //validate it
        if(!email || !otp){
            return res.status(403).json({
                success :false,
                message : "ALL FIELDS ARE REQUIRED",
            })
        }
       
        //check user already exist or not
        const existingUser = await USER.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success :false,
                message : "User Already Exist",
            })
        }
        //find most recent otp stored for the user
        const recentOtp = await OTP.find({email}).sort({createAt:-1}).limit(1);
        console.log("______" , typeof(recentOtp[0]));
        
        console.log("RECENT OTP RESPONSE ",recentOtp ,"\nOUR OTP : ",otp ,"\nDB OTP : ",recentOtp[0].otp);

        //validate otp
        if(recentOtp.length==0){
            return res.status(400).json({
                success :false,
                message : "Otp NOT Found",
            })
        }
        else if(otp!==recentOtp[0].otp.toString()){
            return res.status(400).json({
                success :false,
                message : "Invalid otp",
            })
        }
        //return response
        res.status(200).json({
            success :true,
            message :`Otp is Verified`,
            // user,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Something went wrong while registering",
        })
    }
}


//validat user
exports.validateUser = async(req,res) => {
    try{
        console.log(req.user);
        
        const user = await USER.findById(req.user.id).populate("squad").populate("playerdetail").populate("statistic");
        user.password=undefined;
        console.log(user);
        return res.status(201).json({
            success : true,
            message :"USER IS LOGGED IN",
            data : user
        });



    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "SESSION HAS BEEN EXPIRED PLEASE LOGIN AGAIN",
        })
    }
}

//change password

// Reset password



