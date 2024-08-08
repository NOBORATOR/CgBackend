const mongoose = require("mongoose");
require("dotenv").config();

const connectWithDb = ()=>{
    mongoose.connect(process.env.MONGO_URL).then(console.log("DB CONNECTED"))
    .catch((error)=>{
        console.log("DB not connected");
        console.error(error);
        process.exit(1);
    })
};



module.exports = connectWithDb;


//npm run dev