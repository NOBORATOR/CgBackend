const mongoose = require("mongoose");

const SenderSchema = new mongoose.Schema(
    {
        user_obj_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
        sender : [
            {
                receiver_id: {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "User",
                },
                status : {
                    type : String,
                    enum : ["Accepted","PENDING","Rejected"]
                }
            }
        ],
        
    }
);

module.exports = mongoose.model("Sender",SenderSchema);




