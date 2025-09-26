var express = require('express');
var router = express.Router();
const { createUserValidator } = require("../lib/validators");
const {validator, tryCatch, authenticate, authorize} = require("../middlewares");
const {login, register, assignProcurement, getUsers, deleteUser} = require("../controllers/user");
const { userRoles } = require('../lib/constants');
const { canCreateProcurementManagerOrAdmin, canCreateClientUser, canCreateInspectionManager } = require('../lib/permissionPolicies');
const { ForbiddenError } = require('../lib/errors');
const roleToPolicyMap = {
    [userRoles.ADMIN]: canCreateProcurementManagerOrAdmin,
    [userRoles.CLIENT]: canCreateClientUser,
    [userRoles.PROCUREMENT_MANAGER]: canCreateProcurementManagerOrAdmin,
    [userRoles.INSPECTION_MANAGER]: canCreateInspectionManager,
}

router.post("/register", authenticate, authorize({
    policy: (req) => {
        const userRoleToBeCreated = req.body.role.toLowerCase();
        const hasPerm = roleToPolicyMap[userRoleToBeCreated](req);
        if (!hasPerm) {
            throw new ForbiddenError('Forbidden: insufficient privileges')
        }
    }
}) ,createUserValidator, validator, tryCatch(register));

router.post('/login', tryCatch(login));
router.patch("/assign-procurement", authenticate, authorize(), tryCatch(assignProcurement));

router.get("/", authenticate, authorize(), tryCatch(getUsers))

router.delete("/:user_id", tryCatch(deleteUser))

module.exports = router;
