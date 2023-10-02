const { bookAppointmentFuction, checkAppointmentFunction } = require('../controllers/appointment');

const router = require('express').Router();

router.route("/appointment/create").post(bookAppointmentFuction);
router.route("/appointment/ckeck_status").get(checkAppointmentFunction);

module.exports=router;