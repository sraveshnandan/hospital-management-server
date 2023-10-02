const mongoose = require('mongoose');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const EmployeeSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true, "UserName can't be empty."],
    unique:[true, "UserName should be unique."]
  },
  password:{
    type:String,
    required:[true, "Password is required."],
    minlength:[6, "Password must be at least six characters long."],
    select:false
  },
  avatar:{
    public_id:String,
    url:String
  },
  fullname:{
    type:String,
    required:[true, "fullname can't be empty."],
  },
  email:{
    type:String,
    required:[true, "Email address is required."]
  },
  gender:{
    type:String,
    enum:["male", "female", "other"],
  },
  role:{
    type:String,
    enum:["employee", "admin"],
    default:"employee"
  },
  join_date:{
    type:Date,
    default: Date.now()
  },
  salary:{
    type:Number,
  }

  
},{timestamps:true});

module.exports = new mongoose.model("Employee", EmployeeSchema);

//hashing the password before saving it to the database.

EmployeeSchema.pre("save", async function(next){
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next()
});

//Generating the auth token

EmployeeSchema.methods.generateAuthToken = (id) => {
  return jwt.sign({ _id: id }, process.env.JWT_SECRET, { expiresIn: "1d" })
};