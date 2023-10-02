const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const randomToken = require('random-token');
const { ShowError } = require("../utils/showError");
const { verifyToken } = require('../utils/verifyToken');

exports.signUpFunction = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already exists."
      })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const iv = randomToken(32);
    const verify_token = await bcrypt.hash(iv, 10);
    console.log(verify_token)
    const data = await User.create({
      username,
      fullname,
      email,
      password: hashedPassword,
      verify_token
    });


    res.status(201).json({
      success: true,
      verify_token,
      message: "Account created successfully."
    })
  } catch (error) {
    ShowError(res, error);

  }
}

exports.loginFunction = async (req, res) => {
  try {
    const { username, password } = req.body;
    let user = await User.findOne({ username }).select('password').select('email_status');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No any user found with this username."
      })

    };
    const isPassOk = await bcrypt.compare(password, user.password);
    if (!isPassOk) {
      return res.status(422).json({
        success: false,
        message: "Invalid credientials."
      })
    };
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" })

    const status = user.email_status.toString();
    if (status === "not_verified") {
      return res.status(423).json({
        success: true,
        message: "Please verify your email to continue."
      })

    } else {
      res.status(200).cookie("token", token).json({
        success: true,
        message: "Logged in successfully."
      })
    }
  } catch (error) {
    ShowError(res, error);
  }
}

exports.logoutFunction = async (req, res) => {
  try {
    res.status(200).cookie("token", '').json({
      success: true,
      message: "Logged Out Successfully."
    })

  } catch (error) {
    ShowError(res, error);

  }
}

exports.verifyEmailFunction = async (req, res) => {
  try {
    const { token, id } = req.query;
    const user = await User.findOne({ verify_token: token });
    if (!user) {
      let newuser = await User.findById(id);
      if (!newuser) {
        return res.status(404).json({
          success: false,
          message: "Invalid data provided."
        })
      }
      if (newuser.email_status === 'verified') {
        return res.status(200).json({
          success: true,
          message: "Your email is already verified."
        })
      }
      newuser.email_status = "verified";
      await newuser.save();
      res.status(200).json({
        success: true,
        message: "Email verified successfully."
      })

    }
    if(user){
      if (user.email_status === 'verified') {
        return res.status(200).json({
          success: true,
          message: "Your email is already verified."
        })
      }
      user.email_status = 'verified';
      user.verify_token = 'null';
      await user.save();
      res.status(200).json({
        success: true,
        message: "Email verified successfully."
      })
    }
     
  } catch (error) {
    ShowError(res, error);

  }
}

exports.getProfileFunction = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "No token found , please log in again."
      })

    }
    const decode = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode.id;
    if (decode.exp < Date.now()) {

      let user = await User.findById(req.user);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Invalid token , please login first."
        })

      }
      return res.status(200).json({
        success: true,
        data: user,
        message: "data fetched successfully."
      })



    } else {
      return res.status(403).json({
        success: false,
        message: "token expired, please login again."
      })
    }


  } catch (error) {
    ShowError(res, error);

  }
}

exports.forgotPasswordFunction = async (req, res) => {
  try {
    const { email } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "NO any user found."
      })
    }
    const id = user._id;
    const iv = randomToken(16);
    const token = await bcrypt.hash(iv, 10);

    user.resetPassToken = token;
    await user.save();
    const resetLink = `http://127.0.0.1:4000/api/v1/user/reset_password?id=${id}&token=${token}`;
    res.status(200).json({
      success: true,
      message: "Click on this link to reset your password.",
      link: resetLink
    })




  } catch (error) {
    ShowError(res, error);

  }
}

exports.resetPasswordFunction = async (req, res) => {
  try {
    const { id, token } = req.query;
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    let user = await User.findById(id);
    if (user.resetPassToken === null) {
      return res.status(409).json({
        success: false,
        message: "You have already changed your password , please generate a new reset link."
      })
    }
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found."
      })
    };
    if (user.resetPassToken.toString() === token.toString()) {
      user.password = hashedPassword;
      user.resetPassToken = null;
      user.time = Date.now();
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Password changed successfully."
      })
    } else {
      return res.status(422).json({
        success: false,
        message: "Invalid Token."
      })
    }

  } catch (error) {
    ShowError(res, error);

  }
}



exports.updateProfileFunction = async (req, res) => {
  try {
    const { token } = req.cookies;
    const { username, fullname, email } = req.body;
    if (!token) {
      return res.status(404).json({
        success: false,
        message: "No token found please login first."
      })
    }
    const decode = verifyToken(token);
    let user = await User.findById(decode.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid token please login first."
      })
    }
    user.username = username;
    user.fullname = fullname;
    if (user.email != email) {
      user.email_status = "not_verified"
    }
    user.email = email;


    await user.save();
    res.status(200).json({
      success: true,
      message: "Details updated successfully.",
      updated_details: user
    })
  } catch (error) {
    ShowError(res, error);

  }
}