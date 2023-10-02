const { 
   signUpFunction,
   loginFunction,
   verifyEmailFunction,
   forgotPasswordFunction,
   resetPasswordFunction,
   updateProfileFunction,
   getProfileFunction,
   logoutFunction
       } = require('../controllers/user');

const router = require('express').Router();

router.route('/user/signup').post(signUpFunction);
router.route('/user/login').post(loginFunction);
router.route('/user/logout').get(logoutFunction);
router.route('/user/verify').get(verifyEmailFunction);
router.route('/user/profile').get(getProfileFunction);
router.route('/user/update_profile').put(updateProfileFunction);
router.route('/user/forgot_password').post(forgotPasswordFunction);
router.route('/user/reset_password').post(resetPasswordFunction);

module.exports = router;