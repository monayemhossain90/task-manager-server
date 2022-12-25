const mongoose = require("mongoose");

// OTP Schema
  const OTPSchema = mongoose.Schema(
    {
        Email:{type:String},
        OTP:{type:String},
        Status:{type:Number,default:0},
        CreateDate:{type:Date,default:Date.now()}
    }, {versionKey:false}
)

//Create data model
const OTPModel = mongoose.model("otps",OTPSchema);
module.exports = OTPModel;
