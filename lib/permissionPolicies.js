const canCreateClientUser = (req) => {
    if (req.user.role === "admin") return true;
    if (req.user.role === "procurement_manager") return true;
    return false;
}

const canCreateInspectionManager = (req) => {
    if (req.user.role === "admin") return true;
    if (req.user.role === "procurement_manager") return true;
    return false;
}

const canCreateProcurementManagerOrAdmin = (req) => {
    if (req.user.role === "admin") return true;
    return false;
}

module.exports = {
    canCreateClientUser,
    canCreateInspectionManager,
    canCreateProcurementManagerOrAdmin
}