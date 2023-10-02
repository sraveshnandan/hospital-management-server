const Employee = require("../models/employee");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ShowError } = require("../utils/showError");

//have to improve

exports.loginEmployeeFunction = async(req, res) =>{
  try {
    const {username, password} = req.body;
    let employee = await Employee.findOne({username}).select("password");
    if (!employee) {
      return res.status(404).json({
        success:false,
        message:"No account found."
      })
      
    }
    const isPasswordMatched = await bcrypt.compare(password, employee.password);
    if (!isPasswordMatched) {
      return res.status(423).json({
        success:false,
        message:"Invalid credentials."
      })
      
    }
    const token =  jwt.sign({_id:employee._id}, process.env.JWT_SECRET, {expiresIn:"1d"})
    const options = {
      httpOnly:true,
      secure:true
    }
    res.status(200).cookie("token", token, options).json({
      success:true,
      message:"logged in successfully."
    });

  } catch (error) {
   ShowError(res, error);
  }
}


exports.addEmployeeFunction = async (req, res)=>{
  try {
    const {username, password, fullname, email, gender, role,  salary} = req.body;
    let employee = await Employee.findOne({email});
    if(employee){
      return res.status(409).json({
        success:false,
        message:"Email already exists."
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    employee = await Employee.create({
      username,
      password:hashedPassword,
      avatar:{public_id :"public_id", url: "public url"},
      fullname,
      email,
      gender,
      role,
      salary


    });
    res.status(201).json({
      success:true,
      message:"Employee craeted successfully.",
      details:employee
    })
    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.getAllEmployeeFunction = async (req, res)=>{
  try {
    let employee = await Employee.find({role:"employee"});
    if(!employee){
      return res.status(404).json({
        success:false,
        message:"No any employee yet."
      })
    }
    res.status(200).json({
      success:true,
      message:"Data fetched successfully.",
      data:employee
    })
    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.removeEmployeeFunction = async (req, res)=>{
  try {
    const {id} = req.query;
    let employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({
        success:false,
        message:"No employee found."
      })
      
    }
   res.status(200).json({
    success:true,
    message:"Employee deleted successfully."
   })
    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.updateEmployeeFunction = async(req, res)=>{
  try {
    const {id} = req.query;
    const {fullname, email, role, salary} = req.body;
    let employee = await Employee.findOne({_id:id});
    if(!employee){
      return res.status(404).json({
        success:false,
        message:"Invalid Employee Id, No employee found."
      })
    }
    //Update employee 
    employee.fullname = fullname;
    employee.email = email;
    employee.role = role;
    employee.salary = salary;

    //Saving the employee 
    await employee.save();
    res.status(200).json({
      success:true,
      message:"Details updated successfully.",
      updated_details: employee
    })

    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.generateSalarySlipFunction = async(req, res)=>{
  try {
    const {id} = req.query;
    let employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({
        success:false,
        message:"No employee found, or invalid id provided."
      })
      
    }
    let details = {};
    details.username = employee.username;
    details.email = employee.email;
    details.role = employee.role;
    details.salary = employee.salary;
    res.status(200).json({
      success:true,
      message:"Data fetched successfully.",
      data:details

    })
    
  } catch (error) {
    ShowError(res, error);
  }
}

