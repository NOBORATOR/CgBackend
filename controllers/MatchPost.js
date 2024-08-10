// const GamePost = require("../models/GamePost");
const GAMEPOST= require("../models/GamePost");
const STATISTIC = require("../models/Statistic");
const USER = require("../models/User");



//tested
// Create Match Post
exports.createPost = async(req,res)=>{
    try{
        //fetch data
        const{
            tournament_name,
            game_type,
            number_of_players,
            group_type,
            last_date,
            match_date,
            img,
            match_time,
            link,
            rule,
            price,
            // entryfee
             //watch love babar mega backend class 3 01:00;0
        } = req.body;
        
        
        console.log(req.body);
        console.log(
            typeof tournament_name,
            typeof game_type,
            typeof number_of_players,
            typeof group_type,
            typeof last_date,
            typeof match_date,
            typeof img,
            typeof match_time,
            typeof link,
            typeof rule,
            typeof price,
        );

        let imgl = img;
        if(game_type=="FreeFire"){
            imgl = "https://4.bp.blogspot.com/-oBNm-qVsL0Q/Xap-M-9gerI/AAAAAAAABhE/k6qevOl1c3Uq6sNDw_k-j82R7Gtc_GoMQCK4BGAYYCw/w680/free%2Bfire%2Bmod%2Bapk.jpg"
        }
        else{
            imgl = "https://th.bing.com/th/id/OIP.yWdX_XcIQDt3JIlHTqWjMAHaEK?rs=1&pid=ImgDetMain"
        }

        //validate
        if(!tournament_name || !game_type || !number_of_players || !group_type || !last_date || !match_date  || !match_time || !rule || !price ){
            return res.status(400).json({
                success : false,
                message : "ALL FIELDS ARE REQUIRED",
            });
        }


        // match day should be more than last date of registeration

        if(match_date<last_date){
            return res.status(400).json({
                success : false,
                message : "Last date of registeration should be before match day",
            });
        }

        //check for Who match posted
        
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

        //upload image in cloudinary {PENDING}

        // Create an entry in db for match post
        const newMatch = await GAMEPOST.create({
            user_obj_id : user_id,
            tournament_name : tournament_name,
            game_type : game_type,
            number_of_players : number_of_players,
            group_type : group_type,
            last_date : last_date,
            match_date : match_date,
            img : imgl,
            match_time : match_time,
            link : link,
            rule : rule,
            price : price,
            // entryfee : entryfee
        })

        //add the new match post to the user schema of Match poster
        await USER.findByIdAndUpdate(
            {_id : user_id},
            {
                $push : {
                    game_post : newMatch._id,
                },
                
            },
            {new : true} //
        )


        // return response
        return res.status(200).json({
            success : true,
            message : "MATCH CREATED SUCCESSFULLY",
            data : newMatch,
        })




    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "FAILED TO CREATE MATCH",
            error : error.message,
        })
    }

    //testing data
    // {
    //     "tournament_name" : "ESPORTS FF",
    //     "game_type" : "FreeFire" ,
    //     "number_of_players" : 48,
    //     "group_type" : "Squad",
    //     "last_date" : "08/06/2024",
    //     "match_date" : "11/06/2024" ,
    //      "match_time" : "12:00AM"
    //     "img" : "AEFPHDJFJHSDJH",
    //     "id": "6661981ad1220ae458841498"  //userid is present in token
        
    // }

    //testing new 
    // {
    //     "tournament_name" : "NOBO AND AYU",
    //     "game_type" : "FreeFire" ,
    //     "number_of_players" : 48,
    //     "group_type" : "Squad",
    //     "last_date" : "25/06/2024",
    //     "match_date" : "26/06/2024" ,
    //      "match_time" : "12:00AM",
    //     "img" : "AEFPHDJFJHSDJH",
    //     // "id": "6661981ad1220ae458841498"  //userid is present in token
    //     "link" : "https://www.youtube.com/@noboayu4722",
    //     "rule" : "53498398w98rkcxkxlvnkjj fsfsdfs sdfsdfewtwt4erdfgd "

        
    // }
};


// get all matches
//succcessfully tested

exports.showAllMatches = async(req,res) =>{
    try{

        // fetch all data
        const allMatches = (await GAMEPOST.find({}).populate("user_obj_id"));
        console.log("ALL MATCHES" ,allMatches)
        // allMatches[0].user_obj_id.password = undefined;  //hidePassword


        // return response data
        return res.status(200).json({
            success :true,
            message : "DATA FOR ALL MATCHES FETCHED SUCCESSSFULLY",
            data : allMatches,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "CANNOT FETCH MATCH DATA",
            error : error.message,
        })
    }
};



//find only one gamepost based on id
//tested
exports.showOneMatch = async(req,res) =>{
    try{

        // fetch all data
        const id = req.params.id;
        // console.log(id);
        const oneMatch = await GAMEPOST.findById({_id:id}).populate("user_obj_id").populate({path:"registered",populate: "squad"}).populate("winner");
        console.log(oneMatch);

        if(!oneMatch){
            return res.status(404).json({
                sucess:false,
                message :"NO DATA FOUND",
            })
        }


        // return response data
        return res.status(200).json({
            success :true,
            message : "DATA FOR ONE MATCHES FETCHED SUCCESSSFULLY",
            data : oneMatch,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "CANNOT FETCH MATCH DATA",
            error : error.message,
        })
    }
};



//Post id password
exports.createIdPass = async(req,res)=>{
    try{
        //fetch data
        const{
            id,
            pass,
        } = req.body;

        //validate
        if(!id || !pass ){
            return res.status(400).json({
                success : false,
                message : "ALL FIELDS ARE REQUIRED",
            });
        }

        //check for Who match posted
        
        const user_id = req.user.id; //this is used with help of auth this is our main code dont forget
        const match_id = req.params.id;
        // const user_id = req.body.id; 
        
        const user_details = await USER.findById(user_id);
        // console.log("USER POSTED DETAIL ", user_details);
        console.log("MATCH ID : ",match_id)
        //check if that user is in db or not
        if(!user_details){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }
        
        const match_details = await GAMEPOST.findById(match_id);
        // console.log("ERROR",user_id);
        //check if that match is in db or not
        if(!match_details){
            return res.status(404).json({
                success : false,
                message : "MATCH DOES NOT EXIT LOGIN IN FIRST",
            });
        }
        
        //check if user is owner to posst id and pass
        // console.log(match_details.user_obj_id.toString(),user_details.id);

        //match_details.user_obj_id is new objectId so we have to convert it to string first
        if(match_details.user_obj_id.toString()!=user_id){
            return res.status(404).json({
                success : false,
                message : "Does not have right to post id pass",
            });
        }

        
        //check if current date is same as of match date in db
        // console.log("DATESSSS : _ " ,new Date(match_details.match_date)>=new Date(Date.now()))
        if(new Date(match_details.match_date)>=new Date(Date.now())){
            return res.status(404).json({
                success : false,
                message : "POST ID PASSWORD ON MATCH DAY ONLY",
            });
        }


        // Update id pass in db
        const newIdPass = await GAMEPOST.findByIdAndUpdate(
            {_id:match_details._id},
            {
                $set : {
                    id : id,
                    pass : pass
                }
            },
            {new : true}
        );


        // return response
        return res.status(200).json({
            success : true,
            message : "ID PASSWORD CHANGED SUCCESFULLY",
            data : newIdPass,
        })




    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "FAILED TO Post ID Pass",
            error : error.message,
        })
    }

    // testing data

    // {
    //     "id" : 1234,
    //     "pass" : 2222,
    // }
};




//Announce winner
exports.announceWinner = async(req,res)=>{
    try{
        //fetch data
        const{
            winner_id
        } = req.body;

        //validate
        if(!winner_id ){
            return res.status(400).json({
                success : false,
                message : "ALL FIELDS ARE REQUIRED",
            });
        }

        //check for Who match posted
        const user_id = req.user.id; //this is used with help of auth this is our main code dont forget
        const match_id = req.params.id;
        // const user_id = req.body.id; 

        //match id should be 24 size This we have to take care if its length is not 24 then it throws exception just comment below if then we will understand
        console.log(match_id.length);
        if(match_id.length!=24){
            return res.status(404).json({
                success : false,
                message : "Match Does Not exist",
            });
        }
        
        const user_details = await USER.findById(user_id);
        // console.log("USER POSTED DETAIL ", user_details);
        
        //check if that user is in db or not
        if(!user_details){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }
        
        
        const match_details = await GAMEPOST.findOne({_id:match_id});
        console.log("MATCH ID : ",match_id);
        // console.log("ERROR",user_id);
        // console.log("match_details",match_details)
        //check if that match is in db or not
        if(!match_details){
            return res.status(404).json({
                success : false,
                message : "MATCH DOES NOT EXIT ",
            });
        }
        
        
        //check if user is owner to posst id and pass
        // console.log(match_details.user_obj_id.toString(),user_details.id);

        //match_details.user_obj_id is new objectId so we have to convert it to string first
        if(match_details.user_obj_id.toString()!=user_id){
            return res.status(404).json({
                success : false,
                message : "Does not have right to post winner ",
            });
        }


        //Check if Winner has registered in match or not 
        if(!match_details.registered.includes(winner_id)){
            return res.status(404).json({
                success : false,
                message : "THE USER HAS NOT REGISTERED IN TOURNAMENT",
            });
        }
        
        
        //check if this match has already winner
        if(match_details.winner){
            return res.status(404).json({
                success : false,
                message : "Already Declared winner",
            });
        }

        
        //check if current date is same as of match date in db
        if(match_details.match_date<=Date.now()){
            return res.status(404).json({
                success : false,
                message : "POST WINNER ON MATCH DAY ON MATCH DAY ONLY",
            });
        }


        // Update id pass in db
        const newIdPass = await GAMEPOST.findByIdAndUpdate(
            {_id:match_details._id},
            {
                $set : {
                    winner : winner_id,
                }
            },
            {new : true}
        );

        //update statistics
        const statistic = await STATISTIC.findOneAndUpdate(
            {user_obj_id : winner_id},
            {
                $inc :{
                    win : 1,
                }
            }
        );


        // return response
        return res.status(200).json({
            success : true,
            message : "Winner Updated SuccessFully",
            data : newIdPass,
        })




    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success : false,
            message : "FAILED TO Post WINNER",
            error : error.message,
        })
    }
};





//get user played matches
exports.myMatches = async(req,res) =>{
    try{

        // fetch all data
        const user_id = req.user.id;
        const myMatch = (await USER.findById(user_id).populate("game_played"));
        console.log("ALL MATCHES" ,myMatch)
        // allMatches[0].user_obj_id.password = undefined;  //hidePassword


        // return response data
        return res.status(200).json({
            success :true,
            message : "DATA FOR ALL MATCHES FETCHED SUCCESSSFULLY",
            data : myMatch,
        })

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "CANNOT FETCH MATCH DATA",
            error : error.message,
        })
    }
};

// USERD MBC CLAS_3
