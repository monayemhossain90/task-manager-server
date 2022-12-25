//common import
const express = require("express");
const app = new express;
const  bodyParser = require("body-parser");
const mongoose = require("mongoose");
 const router = require("./src/routes/api")

// Security Middleware Import
    const rateLimit = require("express-rate-limit");
    const helmet =  require("helmet");
    const mongoSanitize = require("express-mongo-sanitize");
    const xss = require("xss-clean");
    const cors = require("cors");
    const hpp = require("hpp");
const { urlencoded } = require("body-parser");

    //  Security Middleware Implement
    app.use(cors());
    app.use(helmet());
    app.use(mongoSanitize());
    app.use(xss());
    app.use(hpp());

    //  rest api request size limit 
    app.use(express.json({limit:"50mb"}));
    app.use(express.urlencoded({limit:"50mb"}))

    //body parser implement
    app.use(bodyParser.json());

    // Request  rate limit
    const limiter = rateLimit(
        {
            windowMs:15 * 60 * 1000, // 15 minutes
            max: 100 // max requests 100 per windowMS
        }
    )
     app.use(limiter)

    //database connection
    let uri = "mongodb+srv://<username>:<password>@cluster0.j7kvy.mongodb.net/task-manager?retryWrites=true&w=majority";
    let option= {user:"task-manager",pass:"oIeD4OqTmujVAXf8", autoIndex:true};

    mongoose.connect(uri,option,(error)=>{
        console.log("database connection success");
        console.log(error)
    })

    //manage frontend routing
    // app.use(express.static('client/build'));
    // app.get("*",(req,res)=>{
    //     req.sendFile(path.resolve(__dirname,"client","build","index.html"))
    // })

    // manage backend routing
     app.use("/api/v1",router)

    //Undefined Route
    app.use('*',(req,res)=>{
    res.status(404).json({status:"fail",data:"Not found"})
    })

    module.exports=app;