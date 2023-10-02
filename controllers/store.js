const Product = require("../models/store");
const { ShowError } = require("../utils/showError");


exports.addProductFunction = async (req, res)=>{
  try {
    const {name, mnf_date, expiry_date, type, price, quantity} = req.body;
    let product = await Product.create({
      name,
      mnf_date,
      expiry_date,
      type,
      price,
      quantity
    })
    res.status(201).json({
      success:true,
      message:"Product added successfully.",
      details:product
    }) 
  } catch (error) {
    ShowError(res, error);
    
  }
}

//Implement regex search
exports.getProductFunction = async (req, res)=>{
  try {
    const {category, name } = req.query;
    if(category){
      let details = await Product.find({type:category});
      if (!details) {
        return res.status(422).json({
          success:false,
          message:"Invalid Category name."
        })
        
      }
      return res.status(200).json({
        success:true,
        message:"Data fetched successfully.",
        count:details.length,
        data:details

      })

    }
    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.removeProductFunction = async (req, res)=>{
  try {
    const {id} = req.query;
    if(!id){
      return res.status(409).json({
        success:false,
        message:"Please provide an id."
      })
    }
    let data = await Product.findByIdAndDelete(id);
    res.status(200).json({
      success:true,
      message:"Product deleted successfully."
    })
    
  } catch (error) {
    ShowError(res, error);
    
  }
}

exports.updateProductFunction = async (req, res)=>{
  try {
    const {id} = req.query;
    const {name, mnf_date, expiry_date, type, price, quantity} = req.body
    
    if (!id) {
      return res.status(409).json({
        success:false,
        message:"Please provide an id."
      })
      
    }
    let product = await Product.findById(id);
    if(!product){
      return res.status(404).json({
        success:false,
        message:"Invalid Id."
      })
    }
    product.name = name;
    product.mnf_date = mnf_date;
    product.expiry_date = expiry_date;
    product.type = type;
    product.price = price;
    product.quantity = quantity;

    await product.save();

    res.status(200).json({
      success:true,
      message:"Product updated successfully.",
      updated_details:product
    })

    
  } catch (error) {
    ShowError(res, error);
    
  }
}