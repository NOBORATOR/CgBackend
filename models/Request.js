const mongoose = require("mongoose");

const ReceiverSchema = new mongoose.Schema(
    {
        user_obj_id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
        },
        request : [
            {
                sender_id: {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "User",
                },
                status : {
                    type : String,
                    enum : ["Accepted","Pending","Rejected"]
                }
            }
        ],
    
    }
 
);

module.exports = mongoose.model("Request",ReceiverSchema);




