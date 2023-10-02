const { 
  addDoctorFunction,
  loginDoctorFunction,
  getProfileFunction,
  getAppointmentsFunction,
  completeAppointmentFunction
     } = require('../controllers/doctor');
const { isAdminMiddleware } = require('../middlewares/authorise');

const router = require('express').Router();

//This routes is used by admin only;

router.route('/doctor/add').post(isAdminMiddleware, addDoctorFunction );

//these can be used by all doctors

router.route('/doctor/login').post(loginDoctorFunction);
router.route('/doctor/profile').get(getProfileFunction);
router.route('/doctor/update_profile').get(getProfileFunction);
router.route('/doctor/appointment').get(getAppointmentsFunction);
router.route('/doctor/complete_appointment').get(completeAppointmentFunction);
module.exports=router;