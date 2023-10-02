const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true, "Name can't be empty."],
  },
  mnf_date:{
    type:String,
    required:[true, "mnf_date can't be empty."],
   

  },
  expiry_date:{
    type:String,
    required:[true, "expiry_date can't be empty."],
  
  },
  type:{
    type:String,
  },
  price:{
    type:Number,
    required:[true, "price can't be empty."],
    
  },
  quantity:{
    type:Number,
    required:[true, "quantity can't be empty."],
    
    
  }

}, {timestamps:true});
module.exports= new mongoose.model("Product", ProductSchema);