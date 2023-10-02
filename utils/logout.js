const { ShowError } = require("./showError")

exports.logoutFunction = (req, res)=>{
  try {
    const {token} = req.cookies;
    if (!token) {
      return res.status(423).json({
        success:false,
        message:"Already logged out."
      })
      
    }
    res.status(200).cookie("token", "").json({
      success:true,
      message:"Logged out successfully."
    })
    
  } catch (error) {
    ShowError(res, error);
    
  }
}