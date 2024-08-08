const USER = require("../models/User");
const PLAYER_DETAIL = require("../models/PlayerDetail");


//for updating player details
exports.playerDetailUpdate = async(req,res)=>{
    try{
        //fetch data
        const{
            matches_played,
            total_win ,
            kill,
            kd
             //watch love babar mega backend class 3 01:00;0
        } = req.body;

        //validate : - no need due to any one entry can be updated
        console.log(matches_played,total_win,kill);
        if(matches_played<total_win){
            return res.status(404).json({
                success : false,
                message : "Matches played is less than win",
            });
        }
       

        //check for Who want to update squad
        const user_id = req.user.id; //this is used with help of auth this is our main code dont forget
        const user_details = await USER.findById(user_id);
        console.log("USER PLYAER : ", user_details);
        
        //check if that user is in db or not

        if(!user_details){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }

        const player_detail = await PLAYER_DETAIL.findOneAndUpdate(
            { user_obj_id : user_id},
            {
                $set : {
                    matches_played:matches_played,
                    total_win : total_win,
                    kill : kill,
                    kd : kd,
                    user_obj_id : user_id,
                }
                
            },
            {new : true} //
        )

        console.log("LASTLLLLLLL " , player_detail);


        return res.status(200).json({
            success : true,
            message : "SQUAD UPDATED SUCESSFULLY",
            data : player_detail,
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE UPDATING PLAYER DETAILS",
            error : error.message,
        })
    }

    //testing purpose 
    // {
        
    //     "matches_played" :128,
    //     "total_win" :46 ,
    //     "kill" : 638,
    //     "kd" : 6
    // } 

};


//for getting player Details

exports.getAllPlayerDetail = async(req,res)=>{
    try{
        
        //check if that user is in db or not

        const player_detail = await PLAYER_DETAIL.find({}).populate("user_obj_id");
        // console.log(squad);


        return res.status(200).json({
            success : true,
            message : "DATA FETCHED SUCCESSFULLY",
            data : player_detail,
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE FETCHING PLAYER DETAILS",
            error : error.message,
        })
    }
};


//for specific player
exports.getPlayerDetail = async(req,res)=>{
    try{
        
        //check if that user is in db or not
        const user_id = req.params.id;

        const player_detail = await PLAYER_DETAIL.find({user_obj_id:user_id});
        // console.log(squad);


        return res.status(200).json({
            success : true,
            message : "DATA FETCHED SUCCESSFULLY",
            data : player_detail,
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE FETCHING PLAYER DETAILS",
            error : error.message,
        })
    }
};


