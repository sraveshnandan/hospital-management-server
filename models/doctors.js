const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const DoctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    reduired: true,
    select: false,
    minlength: [6, "password must be at least six characters long."]
  },
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: String,

  },
  gender: {
    type: String
  },
  address: String,
  phone: {
    type: Number,
    required: true
  },
  avatar: {
    type: String
  },
  reviews: [
    { 
      type: mongoose.Types.ObjectId,
       ref: "Review"
    }
  ],
  appointments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Appointment"
    }

  ],
  department: {
    type: String
  },
  biography: {
    type: String
  }

}, { timestamps: true });

//Hasing the password before saving it to the database

DoctorSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next();

});

//Comparing the password
DoctorSchema.methods.matchPassword = async (password) => {
  return await bcrypt.compare(password, this.password)
};

//generating the Auth token 
DoctorSchema.methods.generateAuthToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "1d" })
};




module.exports = mongoose.model("Doctor", DoctorSchema);