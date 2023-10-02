const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  fullname: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'Email address cant be empty.'],
    unique: true,
  },
  password: {
    type: String,
    minlength: [6, 'password must be at least six character long.'],
    required: true,
    select: false
  },
  email_status: {
    type: String,
    default: "not_verified"
  },
  verify_token: {
    type: String,
    default: undefined
  },
  time: {
    type: Date,
    default: Date.now()
  },
  role: {
    type: String,
    enum: ["patient", "admin"],
    default: "patient",
  },
  appointments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Appointment"
    }
  ],
  resetPassToken: {
    type: String

  }

}, { timestamps: true });


module.exports = mongoose.model('User', userSchema);
