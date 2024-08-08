const mongoose = require("mongoose");

const GamePostSchema = new mongoose.Schema(
    {
        user_obj_id:{
            type : mongoose.Schema.Types.ObjectId,
            ref:"User",
            require:true,
        },
        tournament_name :{
            type : String,
            require :true,
        },
        game_type : {
            type : String,
            enum :["FreeFire","Pubg"],
            require : true,
        },
        number_of_players :{
            type : Number,
            enum : [24,48,100],
            require : true,
        },
        group_type :{
            type : String,
            enum :["Solo","Duo","Squad"],
            require : true,
        },
        registered : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User",
            }
        ],
        winner :{
            type : mongoose.Schema.Types.ObjectId,
            ref:"User",
            // require:true,
        },
        date_created :{
            type : Date,
            default : Date.now,
            require : true,
        },
        last_date : {
            type : Date,
            reuqire : true,
            default : Date.now() + 5 * 24 * 60 * 60 * 1000,
            // max: Date.now() + 20 * 24 * 60 * 60 * 1000,   //not more than 20 dayss
        },
        match_date :{
            type : Date,
            require : true,
            // max: Date.now() + 30 * 24 * 60 * 60 * 1000,  // not more than 30 days
        },
        match_time :{
            type : String,
            // require : true,
        },
        id : {
            type:Number,
        },
        pass : {
            type : Number,
        },
        img : {
            type : String,
            require : true,
        },
        link :{
            type : String,
            // require :true,
        },
        rule :{
            type :String,
            require :true,
        },
        price :{
            type : Number,
            require : true,
        },
        entryfee : {
            type : Number,
            // require : true,
        }
        
    }
);

module.exports = mongoose.model("GamePost",GamePostSchema);




