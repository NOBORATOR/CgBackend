const mongoose = require("mongoose");

const GamePlayedSchema = new mongoose.Schema(
    {
        user_obj_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            require :true,
        },
        matches_played : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "GamePost",
            }
        ]
        
    }
);

module.exports = mongoose.model("GamePlayed",GamePlayedSchema);

//not in use right now


