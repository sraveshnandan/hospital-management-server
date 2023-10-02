const Employee = require("../models/employee");
const jwt = require("jsonwebtoken");
const { ShowError } = require("../utils/showError");

exports.isAdminMiddleware = async (req, res, next)=>{
  try {
    const {token} = req.cookies;
    if(!token){
      return res.status(404).json({
        success:false,
        message:"No token FOund please login first."
      })
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
   console.log(`The authorise middleware is working.`)
    req.user = decode._id;
    let user = await Employee.findById(decode._id);
    if (!user) {
      return res.status(404).json({
        success:false,
        message:"Invalid Token."
      })
      
    }
    if (user.role === "admin") {
      next()
      
    }else{
      res.status(423).json({
        success:false,
        message:"You are no authorised to do this task."
      })
    }

    
    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.isEmployeeOrAdminMiddleware = async (req, res, next)=>{
  try {
    const {token} = req.cookies;
    if(!token){
      return res.status(404).json({
        success:false,
        message:"No token FOund please login first."
      })
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
   console.log(`The authorise middleware is working.`)
    req.user = decode._id;
    let user = await Employee.findById(decode._id);
    if (!user) {
      return res.status(404).json({
        success:false,
        message:"Invalid Token."
      })
      
    }
    if (user.role === "admin" || user.role === "employee") {
      next()
      
    }else{
      res.status(423).json({
        success:false,
        message:"You are no authorised to do this task."
      })
    }

    
  } catch (error) {
    ShowError(res, error);
    
  }
}