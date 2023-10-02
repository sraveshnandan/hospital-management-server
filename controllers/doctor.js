const Doctor = require('../models/doctors');
const Appointment = require('../models/appointments');
const User = require("../models/users")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ShowError } = require("../utils/showError");

const verifyToken = (token )=>{
  return jwt.verify(token, process.env.JWT_SECRET);
}

exports.addDoctorFunction = async (req, res)=>{
  try {
    const {username, password, fullname, email, dob, gender, address, phone, department, biography} = req.body;
    let  doctor = await Doctor.findOne({email});
    if (doctor) {
      return res.status(422).json({
        success:false,
        message:"Email already exists."
      })
      
    }
    doctor = await Doctor.create({
      username,
      password,
      fullname,
      email,
      dob,
      gender,
      address,
      phone,
      avatar:"testing url",
      department,
      biography

    })
    res.status(201).json({
      success:true,
      data:doctor,
      message:"Account created successfully."
    })

    
  } catch (error) {
    ShowError(res, error);
    
  }
};

exports.loginDoctorFunction = async (req, res)=>{
  try {
    const {username, password} = req.body;
    //searching the doctor with given username
    let doctor = await Doctor.findOne({username}).select("password");
    if(!doctor){
      return res.status(404).json({
        success:false, 
        message:"No any account found."
      })
    }
    //Comparing the passwords
    const isPasswordMatched = await bcrypt.compare(password, doctor.password);
    if (!isPasswordMatched) {
      return res.status(423).json({
        success:true,
        message:"Invalid Creadentials."
      })
    }

    const token = doctor.generateAuthToken(doctor._id);
    res.status(200).cookie('token', token).json({
      success:true,
      message:"logged in successfully."
    })


    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.getProfileFunction = async (req, res)=>{
  try {
    const {token } = req.cookies;
    if(!token){
      return res.status(404).json({
        success:true,
        message:"No token found , please login first."
      })
    }
    //Decoding the token 
    const decode = verifyToken(token);
    req.user = decode._id;
    //seaching the doctor in database by id from token
    if (decode.exp < Date.now()) {
      let doctor = await Doctor.findOne({_id:req.user});
      if (!doctor) {
        return res.status(404).json({
          success:false,
          message:"Invalid token."
        })
        
      }
      //Final responce
      return res.status(200).json({
        success:true,
        message:"Data fetched sucessfully.",
        data:doctor
      })


      
    }else{
      return res.status(422).json({
        success:false,
        message:"Token expired, please login first."
      })
    }

    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.updateProfileFunction = async (req, res)=>{
  try {
    res.status(200).json({
      success:true,
      message:"testing ..."
    })
    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.getAppointmentsFunction = async (req, res)=>{
  try {
    const {token } = req.cookies;
    if(!token){
      return res.status(404).json({
        success:true,
        message:"No token found , please login first."
      })
    }
    //Verifying token
    const decode = verifyToken(token);
    let doctor = await Doctor.findById(decode._id).populate("appointments");
    const appointment = doctor.appointments;
    //Checking appointments length
    if (appointment.length <= 0) {
      return res.status(200).json({
        success:true,
        message:"No any appointments yet, be patient."
      })
      
    }
    //Final responce 
    res.status(200).json({
      success:true,
      appointment
    })

  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.completeAppointmentFunction = async (req, res)=>{
  try {
    const {token } = req.cookies;
    const {id} = req.query;
    if(!token){
      return res.status(404).json({
        success:true,
        message:"No token found , please login first."
      })
    }
    //Verifying token
    const decode = verifyToken(token);
    //Finding the doctor
    const doctor = await Doctor.findById(decode._id);
    //Finding the appointment
    let appointment = await Appointment.findById(id);
    if(!appointment){
      return res.status(404).json({
        success:false,
        message:"No any appointment found."
      })
    }
    if(appointment.status === "completed"){
      return res.status(406).json({
        success:true,
        message:"Appointment already completed."
      })
    }
    //Finding the user
    const user = await User.findOne({email:appointment.email});
    //changing the appointment status to pending to completed.
    appointment.status = "completed";
    //removing the completed appointment id from doctors appointments section
    doctor.appointments.pop(id);
    //saving the doctor document
    await doctor.save();
     //removing the completed appointment id from user appointments section
    user.appointments.pop(id);
    //saving the user document
    await user.save();
    //saving the appointment document
    await appointment.save();

    //Final responce
    res.status(200).json({
      success:true,
      message:"Appointment Completed successfully."
    })
    
  } catch (error) {
    ShowError(res, error);
  }
}
