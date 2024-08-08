const mongoose = require("mongoose");

const SquadSchema = new mongoose.Schema(
    {
        user_obj_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            require :true,
        },
        player1_id : {
            type : String,
        },
        player1_name : {
            type : String,
        },
        player2_id : {
            type : String,
        },
        player2_name : {
            type : String,
        },
        player3_id : {
            type : String,
        },
        player3_name : {
            type : String,
        }
        
    }
);

module.exports = mongoose.model("Squad",SquadSchema);