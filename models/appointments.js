const mongoose =  require('mongoose');

const AppointmentSchema = new mongoose.Schema({
  patient_name:{
    type:String,
    required:true
  },
  department:{
    type:String,
    required:true
  },
  doctor_name:{
    type: mongoose.Types.ObjectId,
    ref:"Doctor"
  },
  date:{
    type:String,
    required:true
  },
  time:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  patient_phone:{
    type:String,
    required:true
  },
  status:{
    type:String,
    default :"pending"
  }

}, {timestamps:true});

module.exports = new mongoose.model("Appointment", AppointmentSchema);