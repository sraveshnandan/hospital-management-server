const { addProductFunction, getProductFunction, removeProductFunction, updateProductFunction } = require("../controllers/store");
const { isEmployeeOrAdminMiddleware } = require("../middlewares/authorise");

const router = require("express").Router();

router.route("/product/add").post(isEmployeeOrAdminMiddleware, addProductFunction);
router.route("/product/find").get(isEmployeeOrAdminMiddleware, getProductFunction);
router.route("/product/remove").delete(isEmployeeOrAdminMiddleware, removeProductFunction);
router.route("/product/update").put(isEmployeeOrAdminMiddleware, updateProductFunction);
module.exports = router;