const express = require("express");
const UserController = require("../controllers/UserController");
const TaskController = require("../controllers/TaskController");
const AuthVerifyMiddleware = require("../middleware/AuthVerifyMiddleware")

const router =express.Router();
// API user

router.post("/registration",UserController.registration);
router.post("/login",UserController.login);
router.post("/profileUpdate",AuthVerifyMiddleware,UserController.profileUpdate);
router.get("/profileDetails",AuthVerifyMiddleware,UserController.profileDetails);


//api task 
router.post("/createTask",AuthVerifyMiddleware,TaskController.createTask);
router.get("/deleteTask/:id",AuthVerifyMiddleware,TaskController.deleteTask)
router.get("/updateTaskStatus/:id/:status",AuthVerifyMiddleware,TaskController.updateTaskStatus);
router.get("/listTaskByStatus/:status",AuthVerifyMiddleware,TaskController.listTaskByStatus)
router.get("/taskStatusCount",AuthVerifyMiddleware,TaskController.taskStatusCount);

//API Email Verification

router.get("/RecoverVerifyEmail/:email",UserController.RecoverVerifyEmail);
router.get("/RecoverVerifyOTP/:email/:otp",UserController.RecoverVerifyOTP);
router.post("/RecoverResetPassword",UserController.RecoverResetPassword);

module.exports =router;
