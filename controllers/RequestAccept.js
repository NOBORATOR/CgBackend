const SEND = require("../models/Sender");
const USER = require("../models/User");
const REQUEST = require("../models/Request");
const { recompileSchema } = require("../models/Statistic");

exports.sendRequest = async(req,res)=>{

    try{
        //fetch data
        // const{
        //     id
        //      //watch love babar mega backend class 3 01:00;0
        // } = req.body;
        const id = req.params.id;

        //validate : - no need due to any one entry can be updated
        if(!id){
            return res.status(400).json({
                success : false,
                message : "No id",
            });
        }
        

        //check for Who want to update squad
        // console.log("HERE :_ ",req.user);
        const user_id = req.user.id; //this is used with help of auth this is our main code dont forget
        // const user_id = req.body.id; 
        // console.log("ERROR",user_id);
        const user_details = await USER.findById(user_id);
        console.log("USER WHO REQUESTED ", user_details);
        
        //check if that user is in db or not

        if(!user_details){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }

        // const user_id2 = req.user.id; //this is used with help of auth this is our main code dont forget
        // const user_id = req.body.id; 
        // console.log("ERROR",user_id);
        const user_details2 = await USER.findById(id);
        console.log("USER WHO REQUESTED ", user_details2);
        
        //check if that user is in db or not

        if(!user_details2){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT WHICH WAS SENT REQUEST",
            });
        }


        //fetch all send and request
        const s = await SEND.findOne({user_obj_id : user_id});
        // const r = await REQUEST.findById({_id : user_details2.request._id});
        // console.log("SENDER : " ,s.sender);
        // console.log("RECIEVER : ",r.request);

        //check if already sent request to user
        if(s.sender.some(obj=>obj.receiver_id.toString()===id)){
            return res.status(500).json({
                success : false,
                message : "ALREADY SENT REQUEST",
            });
        }


        const send = await SEND.findOneAndUpdate(
            { user_obj_id : user_id},
            {
                $push : {
                    sender : {
                        receiver_id : id,
                        status : "Pending",
                    }
                }
                
            },
            {new : true} //
        )

        const rec = await REQUEST.findOneAndUpdate(
            {user_obj_id:id},
            {
                $push : {
                    request : {
                       sender_id :user_details._id,
                       status : "Pending",
                    }
                }
            }
        )

        // console.log(send);


        return res.status(200).json({
            success : true,
            message : "",
            data : {send,rec},
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE SENDING REQUEST",
            error : error.message,
        })
    }

};


exports.acceptRequest = async(req,res)=>{

    try{
        //fetch data
        // const{
        //     id
        //      //watch love babar mega backend class 3 01:00;0
        // } = req.body;
        const id = req.params.id;

        //validate : - no need due to any one entry can be updated
        if(!id){
            return res.status(400).json({
                success : false,
                message : "No id",
            });
        }
        

        //check for Who want to update squad
        // console.log("HERE :_ ",req.user);
        const user_id = req.user.id; //this is used with help of auth this is our main code dont forget
        // const user_id = req.body.id; 
        // console.log("ERROR",user_id);
        const user_details = await USER.findById(user_id);
        console.log("USER WHO REQUESTED ", user_details);
        
        //check if that user is in db or not

        if(!user_details){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }

        const user_details2 = await USER.findById(id);
        console.log("USER WHO REQUESTED ", user_details2);
        
        //check if that user is in db or not

        if(!user_details2){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT WHICH WAS SENT REQUEST ",
            });
        }

        //fetch all send and request
        // const s = await SEND.findOne({user_obj_id : user_id});
        // const r = await REQUEST.findById({_id : user_details2.request._id});
        // console.log("SENDER : " ,s.sender);
        // console.log("RECIEVER : ",r.request);

        //check if already sent request to user
        // if(s.sender.some(obj=>obj.receiver_id.toString()===id)){
        //     return res.status(500).json({
        //         success : false,
        //         message : "ALREADY SENT REQUEST",
        //     });
        // }
    
        //Update Sender list by ACCEPTED
        // const result = await SEND.findOneAndUpdate(
        //     { user_obj_id : user_id , 'sender.receiver_id' : user_details2._id },
        //     { '$set': { 'sender.$.status': "Accepted" } },
        //     { new: true }
        // );
        const result = await SEND.findOneAndUpdate(
            { user_obj_id : id , 'sender.receiver_id' : user_id },
            { '$set': { 'sender.$.status': "Accepted" } },
            { new: true }
        );


        //Update RECIEVER list by ACCEPTED
        const result2 = await REQUEST.findOneAndUpdate(
            { user_obj_id : user_id , 'request.sender_id' : id },
            { '$set': { 'request.$.status': "Accepted" } },
            { new: true }
        );


        
        // console.log(send);


        return res.status(200).json({
            success : true,
            message : "ACCEPTED REQUEST",
            data : {result,result2},
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE ACCEPTING REQUEST ",
            error : error.message,
        })
    }

};


exports.rejectRequest = async(req,res)=>{

    try{
        
        const id = req.params.id;

        //validate : - no need due to any one entry can be updated
        if(!id){
            return res.status(400).json({
                success : false,
                message : "No id",
            });
        }
        

        //check for Who want to update squad
        // console.log("HERE :_ ",req.user);
        const user_id = req.user.id; //this is used with help of auth this is our main code dont forget
        // const user_id = req.body.id; 
        // console.log("ERROR",user_id);
        const user_details = await USER.findById(user_id);
        console.log("USER WHO REQUESTED ", user_details);
        
        //check if that user is in db or not

        if(!user_details){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }

        const user_details2 = await USER.findById(id);
        console.log("USER WHO REQUESTED ", user_details2);
        
        //check if that user is in db or not

        if(!user_details2){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT WHICH WAS SENT REQUEST ",
            });
        }

        //fetch all send and request
        // const s = await SEND.findOne({user_obj_id : user_id});
        // const r = await REQUEST.findById({_id : user_details2.request._id});
        // console.log("SENDER : " ,s.sender);
        // console.log("RECIEVER : ",r.request);

        //check if already sent request to user
        // if(s.sender.some(obj=>obj.receiver_id.toString()===id)){
        //     return res.status(500).json({
        //         success : false,
        //         message : "ALREADY SENT REQUEST",
        //     });
        // }
    
        //Update Sender list by ACCEPTED
        // const result = await SEND.findOneAndUpdate(
        //     { user_obj_id : user_id , 'sender.receiver_id' : user_details2._id },
        //     { '$set': { 'sender.$.status': "Rejected" } },
        //     { new: true }
        // );

        const result = await SEND.findOneAndUpdate(
            { user_obj_id : id , 'sender.receiver_id' : user_id },
            { '$set': { 'sender.$.status': "Rejected" } },
            { new: true }
        );
        

        
        //Update RECIEVER list by ACCEPTED
        // const result2 = await REQUEST.findOneAndUpdate(
        //     { user_obj_id : user_details2._id , 'request.sender_id' : user_details._id },
        //     { '$set': { 'request.$.status': "Rejected" } },
        //     { new: true }
        // );

        const result2 = await REQUEST.findOneAndUpdate(
            { user_obj_id : user_id , 'request.sender_id' : id },
            { '$set': { 'request.$.status': "Rejected" } },
            { new: true }
        );


        
        // console.log(send);


        return res.status(200).json({
            success : true,
            message : "REJECTED REQUEST",
            data : {result,result2},
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE REJECTING REQUEST ",
            error : error.message,
        })
    }

};


exports.totalRequest = async(req,res)=>{

    try{
        //fetch data
        // const{
        //     id
        //      //watch love babar mega backend class 3 01:00;0
        // } = req.body;
        // const id = req.params.id;

        //validate : - no need due to any one entry can be updated
        // if(!id){
        //     return res.status(400).json({
        //         success : false,
        //         message : "No id",
        //     });
        // }
        

        //check for Who want to update squad
        // console.log("HERE :_ ",req.user);
        const user_id = req.user.id; //this is used with help of auth this is our main code dont forget
        // const user_id = req.body.id; 
        // console.log("ERROR",user_id);
        const user_details = await REQUEST.find({
            user_obj_id:user_id}).populate({
                path: 'request.sender_id',
                populate: [
                    { path: 'playerdetail' },   // Populate player details
                    // { path: 'game_post' },      // Populate game posts
                    // { path: 'game_played' },    // Populate games played
                    // { path: 'squad' },          // Populate squad
                    // { path: 'statistic' },      // Populate statistics
                ]
            });
        console.log("USER WHO REQUESTED ", user_details);
        
        //check if that user is in db or not

        if(!user_details){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }





        return res.status(200).json({
            success : true,
            message : "TOTAL REQUEST",
            data : {user_details},
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE FETCHING TOTAL REQUEST ",
            error : error.message,
        })
    }

};



exports.friends = async(req,res)=>{

    try{
        
        const user_id = req.user.id;
        const user_details = await REQUEST.find({
            user_obj_id:user_id}).populate({
                path: 'request.sender_id',
                populate: [
                    { path: 'playerdetail' },
                ]
            });
        // const user_details = {};

        const user_details2 = await SEND.find({
                user_obj_id:user_id}).populate({
                    path: 'sender.receiver_id',
                    populate: [
                        { path: 'playerdetail' },
                    ]
        });
        // const user_details2 = {};
        console.log("USER WHO REQUESTED ", user_details);
        
        //check if that user is in db or not

        if(!user_details || !user_details2){
            return res.status(404).json({
                success : false,
                message : "USER DOES NOT EXIT LOGIN IN FIRST",
            });
        }





        return res.status(200).json({
            success : true,
            message : "TOTAL FRIENDS REQUEST",
            data : {user_details,user_details2}
        })


    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "ERROR WHILE FETCHING REQUEST ",
            error : error.message,
        })
    }

};