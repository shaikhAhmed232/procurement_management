const router = require("express").Router();
const { create, getById, updateStatus } = require("../controllers/order");
const { createOrderValidators, updateOrderStatusValidators } = require("../lib/validators");
const { validator, authenticate, authorize, tryCatch } = require("../middlewares")

router.use(authenticate, authorize())
router.route("/")
    .post(createOrderValidators, validator, create)

router.route("/:orderId")
    .get(tryCatch(getById));
router.route("/:orderId/status")
    .patch(updateOrderStatusValidators, validator, updateStatus)

module.exports = router;