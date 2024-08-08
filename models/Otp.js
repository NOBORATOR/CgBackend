const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const OtpSchema = new mongoose.Schema(
    {
        email :{
            type : String,
            require : true,
        },
        otp:{
            type : Number,
            require : true,
        },
        created_at :{
            type : Date,
            default : Date.now(),
            expires : 5 *60 *1000,
        }
    }
);

// a funcion to send email before data is stored in db
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email from Esport",otp);
        console.log("Enail Sent successfully",mailResponse);

    }
    catch(error){
        console.log("ERROR WHILE SENDING MAIL", error);
        throw error;
    }
}
OtpSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
})

module.exports = mongoose.model("Otp",OtpSchema);