let jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
    const token = req.headers["token"]
    jwt.verify(token, 'secret12345', function(err, decoded) {
        if (err){
            res.status(400).json({status:"Failed",data:err})
        }
        else{
            let email = decoded["data"];
            req.headers.email = email;
            next()
        }

    });
}