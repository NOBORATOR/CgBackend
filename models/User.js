const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        email :{
            type : String,
            require:true
        },
        password : {
            type : String,
            require : true,
        },
        user_id : {
            type : String,
            require : true,
            trim : true,
            unique : true
        },
        game_id :{
            type : Number,
            require:true
        },
        in_game_name :{
            type : String,
            require : true
        },
        statistic:{
                type : mongoose.Schema.Types.ObjectId,
                ref : "Statistic",
        },
        image :{
            type : String
        },
        game_post :[
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "GamePost",
            }
        ],
        game_played :[
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "GamePost",
            }
        ],
        squad :{
            type : mongoose.Schema.Types.ObjectId,
            ref:"Squad",
        },
        playerdetail : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "PlayerDetail",
        },
        request :
        {
            type : mongoose.Schema.Types.ObjectId,
            ref :"Request",
        },
        send :
        {
            type : mongoose.Schema.Types.ObjectId,
            ref :"Send",
        },
        
    }
);

module.exports = mongoose.model("User",userSchema);




