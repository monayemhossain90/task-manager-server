const mongoose = require("mongoose");

//Schema (Data shape)
const DataSchema = mongoose.Schema(
    {
        Title: { type: String,unique:true },
        Description:{type:String},
        Status: { type: String },
        Email: { type: String },
        CreateDate: { type: Date, default: Date.now() }
    },
    {versionKey:false}
)

//Create data model
const TaskModel = mongoose.model("tasks",DataSchema);
module.exports = TaskModel;