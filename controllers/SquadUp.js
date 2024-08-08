const SQUAD = require("../models/Squad");
const USER = require("../models/User");


exports.suqadEntry = async(req,res)=>{

    try{
        //fetch data
        const{
            player1_id,
            player1_name,
            player2_id,
            player2_name,
            player3_id,
            player3_name,
             //watch love babar mega backend class 3 01:00;0
        } = req.body;

        //validate : - no need due to any one entry can be updated
        // if(!player1_id  || !player1_name || !player2_id  || !player2_name || !player3_id|| !player3_name){
        //     return res.status(400).json({
        //         success : false,
        //         message : "ALL FIELDS ARE REQUIRED",
        //     });
        // }

        //check for Who want to update squad
        // console.log("HERE :_ ",req.user);
        const user_id = req.user.id; //this is used with help of auth this is our main code dont forget
        // const user_id = req.body.id; 
        // console.log("ERROR",user_id);
        const user_details = await USER.findById(user_id);
        console.log("USER POSTED DETAIL ", user_details);
        
        //check if that user is in db or not

        if(!user_details){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }

        const squad = await SQUAD.findOneAndUpdate(
            { user_obj_id : user_id},
            {
                $set : {
                    player1_id:player1_id,
                    player1_name : player1_name,
                    player2_id : player2_id,
                    player2_name : player2_name,
                    player3_id : player3_id,
                    player3_name :player3_name
                }
                
            },
            {new : true} //
        )

        console.log(squad);


        return res.status(200).json({
            success : true,
            message : "SQUAD UPDATED SUCESSFULLY",
            data : squad,
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE UPDATING DATA",
            error : error.message,
        })
    }

    //testing

    // {
    //     "player1_id" : "1",
    //     "player1_name" : "AYUSH",
    //     "player2_id" : "2",
    //     "player2_name" : "ROHIT",
    //     "player3_id" : "3",
    //     "player3_name" : "VISHAL"
    // } 

};


//tested we cam use this for both fetching and updating
//I THINK THIS IS FINISHED 