
const GAMEPOST= require("../models/GamePost");
// const GAMEPLAY = require("../models/GamePlayed");
const USER = require("../models/User");
const STATISTIC = require("../models/Statistic");
const GAMEPLAYED = require("../models/GamePlayed");
// const GamePost = require("../models/GamePost");


exports.register = async(req,res) =>{
    try{
        //one validagtion is remaining for sqaud null

        // get match obj id from params
        const id = req.params.id;

        //check if match exist in db
        const match = await GAMEPOST.findById({_id:id}).populate("user_obj_id");

        if(!match){
            return res.status(404).json({
                sucess:false,
                message :"NO MATCH FOUND",
            });
        }

        //get user who is registering
        const user_id = req.user.id; 

        //check if user exist in db
        const user_details = await USER.findById(user_id);
        console.log("USER DETAIL WHO IS REGISTERING ", user_details);

        //check if user is undefined or not
        if(!user_details){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }
        user_details.password = undefined;


        //check if user has already registered or not
        if(match.registered.includes(user_id)){
            return res.status(403).json({
                success :false,
                message : "Already Registered",
                data : user_details,
            })
        }

        // update USER Profile by adding match id to user profile
        await USER.findByIdAndUpdate(
            {_id : user_id},
            {
                $push : {
                    game_played : id,
                },
                
            },
            {new : true} //
        )

        //update match post by adding user id to match post schema

        await GAMEPOST.findByIdAndUpdate(
            {_id:id},
            {
                $push : {
                    registered : user_id,
                },
            },
            {new:true}
        )
        

        //update gameplayed and add userid in it
        await GAMEPLAYED.findOneAndUpdate(
            {user_obj_id:user_id},
            {
                $push :{
                    matches_played : id,
                }
            },
            {new:true}
        )

        // Update STATISTICS schema by adding 1 or increment statistics
        await STATISTIC.findOneAndUpdate(
            {user_obj_id : user_id},{
                $inc : {
                    total_matches : 1
                }
            },
            {new:true}
            
        )



        // return response data
        return res.status(200).json({
            success :true,
            message : "SuccessFully Registered",
            data : user_details,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "CANNOT REGISTER TO MATCH",
            error : error.message,
        })
    }
};