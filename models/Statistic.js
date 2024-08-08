const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema(
    {
        user_obj_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            require :true,
        },
        total_matches :{
            type : Number,
            // default : 0
        },
        win :{
            type : Number,
            // default : 0,
        },
    }
);

module.exports = mongoose.model("Statistic",statisticSchema);