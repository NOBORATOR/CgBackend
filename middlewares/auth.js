const jwt = require("jsonwebtoken");
require("dotenv").config();
const USER = require("../models/User");

//auth
exports.auth = async(req,res,next) =>{
    try{
        //extract token
        // console.log(req);
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer","");

        //if token missing , then response

        if(!token){
            return res.status(401).json({
                success : false,
                message : "Token is missing",

            });
        }

        //verify the token

        try{
            const decode = await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
            // console.log(req);
        }
        catch(error){
            return res.status(401).json({
                success : false,
                message : "Please Login",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success : false,
            message : "Please Login",
        });
    }
}