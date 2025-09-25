const router = require("express").Router();
const { checklistValidations, updateChecklistStatusValidators } = require("../lib/validators");
const { validator, authenticate, authorize, tryCatch } = require("../middlewares");
const { create, list, getById, update, delete: deleteChecklist } = require("../controllers/checklist");

router.use(authenticate, authorize());
router.route("/")
    .get(tryCatch(list))
    .post(checklistValidations, validator, tryCatch(create));
router.route("/:checklistId")
    .get(tryCatch(getById))
    .put(checklistValidations, validator, tryCatch(update))
    .delete(tryCatch(deleteChecklist))

router.route("/:checklistId/status")
    .patch(updateChecklistStatusValidators, validator, (tryCatch(update)))

module.exports = router;