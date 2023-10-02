const { addEmployeeFunction, loginEmployeeFunction, getAllEmployeeFunction, removeEmployeeFunction, updateEmployeeFunction, generateSalarySlipFunction } = require('../controllers/employee');
const { isAdminMiddleware } = require('../middlewares/authorise');
const { logoutFunction } = require('../utils/logout');

const router = require('express').Router();
//These routest are used by both admin  or employee

router.route("/employee/login").post(loginEmployeeFunction)

router.route("/employee/logout").get(logoutFunction);

//These routest can be only used by admin 

router.route("/employee/add_employee").post(isAdminMiddleware, addEmployeeFunction);

router.route("/employee/get_employee").get(isAdminMiddleware, getAllEmployeeFunction);

router.route("/employee/remove_employee").delete(isAdminMiddleware, removeEmployeeFunction);

router.route("/employee/update_employee").put(isAdminMiddleware, updateEmployeeFunction);

router.route("/employee/gen_salary_slip").get(isAdminMiddleware, generateSalarySlipFunction);

module.exports=router;