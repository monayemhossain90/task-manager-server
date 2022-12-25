const TaskModel = require('../models/TaskModel')

    //Create task
    exports.createTask =(req,res)=>{
        let reqBody = req.body;
        reqBody.Email =req.headers["email"]
        TaskModel.create(reqBody,(err,data)=>{
            if (err){
                res.status(400).json({status:"Failed",data:err})
            }
            else{
                res.status(200).json({status:"success",data:data})
            }
        })
    }

    //Update task status
    exports.updateTaskStatus = (req,res)=>{
        let id = req.params.id;
        let status = req.params.status
        let query = {_id:id};
        let reqBody = {Status:status}
        TaskModel.updateOne(query,reqBody,(err,data)=>{
            if(err){
                res.status(400).json({status:"Failed",data:err})
            }
            else{
                res.status(200).json({status:"Success",data:data})
            }
        })
    }

    // Delete Task
    exports.deleteTask=(req,res)=>{
        let id= req.params.id;
        let query={_id:id};
        TaskModel.remove(query,(err,data)=>{
            if(err){
                res.status(400).json({status:"fail",data:err})
            }
            else{
                res.status(200).json({status:"success",data:data})
            }
        })
    }

    // List  Task By Status
    exports.listTaskByStatus =(req,res)=>{
        let status = req.params.status;
        let email = req.headers['email'];
        TaskModel.aggregate(
            [
                {$match:{Status:status, Email:email}},
                {$project:{
                    _id:1,Title:1,Description:1,Status:1,
                        CreateDate:{
                        $dateToString:{
                            date:"$CreateDate",
                            format:"$d-$m-$y"
                        }

                        }
                    }}
            ],
            (err,data)=>{
                if (err){
                    res.status(400).json({status:"Failed",data:err})
                }

                else{
                    res.status(200).json({status:"Success",data:data})
                }
            }
        )
    }

    // Task status count
    exports.taskStatusCount =(req,res)=>{
        let email = req.headers['email'];
        TaskModel.aggregate(
            [
                {$match:{Email:email}},
                {$group:{_id:"$Status",sum:{$count:{}}}}
            ],
            (err,data)=>{
                if (err){
                    res.status(400).json({status:"Failed",data:err})
                }
                else{
                    res.status(200).json({status:"success",data:data})
                }
            }
        )
    }
