const router = require("express").Router();
const { create, getById, updateStatus } = require("../controllers/order");
const { createOrderValidators, updateOrderStatusValidators } = require("../lib/validators");
const { validator, authenticate, authorize } = require("../middlewares")

router.use(authenticate, authorize())
router.route("/")
    .post(createOrderValidators, validator, create)

router.route("/:orderId")
    .get(getById);
router.route("/:orderId/status")
    .patch(updateOrderStatusValidators, validator, updateStatus)

module.exports = router;