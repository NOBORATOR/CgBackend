const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');

require('dotenv').config();
const PORT = process.env.PORT || 3300;


//middleware
app.use(express.json());

const game =  require("./routers/blog");


// Use the cors middleware
// Enable CORS for all routes
app.use(cors({
    origin: 'http://localhost:3000', // frontend URL
    credentials: true, // Allow credentials (cookies)
  }));

//parse cookie
app.use(cookieParser());

//mount
app.use("/api/v1",game);

const connectWithDB = require("./config/database");
connectWithDB();

app.listen(PORT,()=>{
    console.log(`APP IS STARTED AT PORT NO ${PORT}`);
})


app.get("/",(req,res)=>{
    res.send("<h1>THIS IS MY HOME PAGE</h1>")
})
