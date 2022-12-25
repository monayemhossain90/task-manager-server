const UserModel = require("../models/UserModel");
let jwt = require("jsonwebtoken");
const OTPModel = require("../models/OTPModel");
const sendEmailUtility = require("../utility/SendEmailUtility");

    //CRUD Operation

   // Registration
    exports.registration =(req,res)=>{
        let reqBody = req.body;
        UserModel.create(reqBody,(err,data)=>{
            if (err){
                res.status(200).json({status:"Fail",data:err})
            }
            else{
                res.status(200).json({status:"Success",data:data})
            }
        })
    }

    // Login
        exports.login =(req,res)=>{
        let reqBody = req.body;
        UserModel.aggregate(
            [
                {$match:reqBody},
                {$project:{_id:0,Email:1,FirstName:1,LastName:1,Mobile:1,Password:1,Photo:1,CreateDate:1}},
            ],

            (err,data)=>{
                if (err){
                    res.status(400).json({status:"Fail",data:err})
                }
                else{
                    if (data.length>0){
                    let Payload = {
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data:data[0]['Email']
                    };
                    //create token
                    let token = jwt.sign(Payload,"secret12345");

                    res.status(200).json({status:"Success",token:token,data:data[0]})
                    }
                    else{
                        res.status(401).json({status:"Unauthorized"})
                    }

                }
            }
        )
    }

    // Update
        exports.profileUpdate =(req,res)=>{

       let email =req.headers["email"] //email collect from authverify middleware
        let reqBody = req.body;
        UserModel.updateOne({Email:email},reqBody,(err,data)=>{
            if(err){
                res.status(400).json({status:"Fail",data:err})
            }
            else{
                res.status(200).json({status:"Success",data:data})
            }
        })
    }

    // Profile Details
        exports.profileDetails =(req,res)=>{

        let email =req.headers["email"] //email collect from authverify middleware
        UserModel.aggregate(
            [
               {$match:{Email:email}},
               {$project:{_id:1,Email:1,FirstName:1,LastName:1,Mobile:1,Password:1,Photo:1}}    

            ],
            (err,data)=>{
                if(err){
                    res.status(400).json({status:"Fail",data:err})
                }
                else{
                    res.status(200).json({status:"Success",data:data})
                }
            })

        }

        // Recover Verify Email
        exports.RecoverVerifyEmail = async(req,res)=>{
            let Email = req.params.email;
            let OTPCode = Math.floor(100000+ Math.random()* 900000);
             
            try{
            //email query
            let UserCount = (await UserModel.aggregate(
                [
                    {$match:{Email:Email}},
                    {$count:"total"}
                ]
                ))

                if (UserCount.length>0) {
                     // OTP  insert
                     let CreateOTP = await OTPModel.create({Email:Email,OTP:OTPCode});
                     
                     // OTP send in email
                     let SendEmail = await sendEmailUtility(Email,"Your Pin code is "+ OTPCode,"Task Manager pin code verification");

                     res.status(200).json({status:"Success",data:SendEmail})
                }
                else{
                    res.status(200).json({status:"Fail",data:"No user found"})
                }
            }
            catch(err){
                    res.status(200).json({status:"Fail",data:err})  
                    console.log(err)
            }
            

        }

        // Recover Verify OTP

        exports.RecoverVerifyOTP = async(req,res)=>{
        let Email= req.params.email;
        let OTPCode=  req.params.otp;
        let Status = 0;
        let StatusUpdate=1

        try{
            let OTPCount = await OTPModel.aggregate(
                [
                    {$match:{Email:Email,OTP:OTPCode,Status:Status}},
                    {$count:"total"}
                    ]
            )

            if (OTPCount.length>0){
               let OTPUpdate = await OTPModel.updateOne({Email:Email,OTP:OTPCode,Status:Status},{Email:Email,OTP:OTPCode,Status:StatusUpdate})
                res.status(200).json({status:"Success",data:OTPUpdate})
            }
            else{
                res.status(200).json({status:"Success", data:"OTP is invalid"})
            }
        }
        catch (err){
            res.status(200).json({status:"Fail", data:err})
            }

        }

        // Recover Reset Password
            exports.RecoverResetPassword = async (req,res)=>{
            let Email = req.body["Email"];
            let OTPCode = req.body["OTP"];
            let NewPassword = req.body["Password"];
            let StatusUpdate = 1;

            try{
                let OTPVerifyCount = await OTPModel.aggregate(
                    [
                        {$match:{Email:Email,OTP:OTPCode,Status:StatusUpdate}},
                        {$count:"total"}
                    ]
                )
                if (OTPVerifyCount.length >0 ){
                            let PasswordUpdate = await UserModel.updateOne({Email:Email},{Password:NewPassword})
                    res.status(200).json({status:"Success",data:PasswordUpdate})
                }
                else{
                    res.status(200).json({status:"Fail", data:"Invalid Request"})
                }
            }
            catch(err){
            
                res.status(200).json({status:"Fail",data:err})
            }

            }

