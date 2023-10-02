const Appointment = require("../models/appointments");
const Doctor = require("../models/doctors");
const User = require("../models/users");
const { ShowError } = require("../utils/showError");

exports.bookAppointmentFuction = async (req, res) => {
  try {
    const { patient_name, department, doctor_name, date, time, email, patient_phone, id } = req.body;

    let appointment = await Appointment.findOne({ email }).populate("doctor_name");

    if (appointment.status === "pending") {
      return res.status(409).json({
        success: false,
        details:appointment,
        message: "Your appointment is already booked.",
      })
    }
    appointment = await Appointment.create({
      patient_name,
      department,
      doctor_name,
      date,
      time,
      email,
      patient_phone
    });
    let doctor = await Doctor.findById(doctor_name);
    doctor.appointments.unshift(appointment._id);
    await doctor.save();
    let user = await User.findById(id);
    user.appointments.unshift(appointment._id);
    await user.save();
    //final responce
    res.status(200).json({
      success: true,
      message: "Appointment booked successfully.",
      details: appointment
    })

  } catch (error) {
    ShowError(res, error);

  }
}

exports.checkAppointmentFunction = async (req, res)=>{
  try {
    const {id}= req.query;
    let appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success:false,
        message:"No appointment found."
      })
      
    }
    let status = appointment.status;
    if (status === "pending") {
      return  res.status(200).json({
        success:true,
        status,
        message:"Details fetched successfully."
      })
      
    }else if(status === "completed"){
      return  res.status(200).json({
        success:true,
        status,
        message:"Details fetched successfully."
      })

    }
   
    
  } catch (error) {
    ShowError(res, error);
  }
}

