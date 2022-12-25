    const mongoose = require("mongoose");

//Schema (Data shape)
const DataSchema = mongoose.Schema(
    {
        Email: { type: String,unique:true },
        FirstName:{type:String},
        LastName: { type: String },
        Password: { type: String },
        Photo: { type: String },
        Mobile: { type: String },
        CreateDate: { type: Date, default: Date.now() }
    },
    {versionKey:false}
)

//Create data model
const UserModel = mongoose.model("users",DataSchema);
module.exports = UserModel;