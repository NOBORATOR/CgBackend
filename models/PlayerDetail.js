const mongoose = require("mongoose");

const PlayerDetailSchema = new mongoose.Schema(
    {
        user_obj_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            require :true,
        },
        matches_played :{
            type : Number,
            default : 0,
            require : true,
        },
        total_win :{
            type : Number,
            default : 0,
            require : true,
        },
        kill :{
            type : Number,
            default : 0,
        },
        kd :{
            type : Number,
            default : 2,
        }

        
    }
);

module.exports = mongoose.model("PlayerDetail",PlayerDetailSchema);




