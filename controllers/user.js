const User = require("../models/user");
const { NotFoundError, BadRequestError, ForbiddenError } = require("../lib/errors");
const { statusCode, userRoles, rolesAllowedWithEmail, rolesAllowedWithMobile } = require("../lib/constants");

exports.register = async (req, res) => {
    const data = req.body;
    data.role = data.role.toLowerCase();
    
    if (data.role === "inspection_manager" && !("procurement_manager" in data)) {
        data["procurement_manager"] = req.user._id
    }
    const newUser = await User.create(data);
    const user = await User.findById(newUser._id).select('-password');
    res.status(statusCode.CREATED).json(user);
}

exports.login = async (req, res) => {
    let { email, mobile_number, role, password } = req.body;
    role = role.toLowerCase();
    let query = {
        role, 
    };
    if (!role) {
        throw new BadRequestError(`Please select your role, [${Object.values(userRoles)}]`);
    };
    if (rolesAllowedWithEmail.includes(role)) {
        if (!email) {
            throw new BadRequestError(`Need to provide email for role ${role}`);
        };
        query["email"] = email;
    }
    if (rolesAllowedWithMobile.includes(role)) {
        if (!mobile_number) {
            throw new BadRequestError(`Mobile number is required for ${role}`);
        };
        query["mobile_number"] = mobile_number;
    }
    const user = await User.findOne(query).select({email: 1, name: 1, role: 1, password: 1, mobile_number: 1});
    if (!user) {
        const error = new BadRequestError("Invalid credentials");
        throw error;
    }
    const passwordIsValid = await user.isValidPassword(user.password, password);
    if (!passwordIsValid) {
        throw new BadRequestError("Invalid Credentials");
    }
    const token = user.generateJwt();
    const userPayload = Object.assign({}, user._doc);
    delete userPayload.password;
    res.status(statusCode.OK)
    .json({
        token,
        user: userPayload,
    });
}

exports.assignProcurement = async (req, res) => {
    const {procurement_id, inspection_id} = req.body;

    const inspectionManager = await User.findById(inspection_id);

    if (!inspectionManager) {
        throw new NotFoundError("Inpection manager does not exists");
    }

    inspectionManager.procurement_manager = procurement_id;
    await inspectionManager.save();
    delete inspectionManager._doc.password;
    res.status(statusCode.OK)
    .json(inspectionManager);
}

exports.getUsers = async (req, res) => {
    const {user_type} = req.query;
    const query = {};
    if (user_type) {
        query["role"] = user_type;
    }
    if (req.user.role === userRoles.PROCUREMENT_MANAGER) {
        query["role"] = userRoles.INSPECTION_MANAGER;
        query["procurement_manager"] = req.user._id;
    }

    const users = await User.find(query).populate('procurement_manager', 'name email mobile_number role created_at updated_at').select('name email mobile_number role created_at updated_at');

    res.status(statusCode.OK).json(users);
}

exports.deleteUser = async (req, res) => {
    const {user_id} = req.params;

    const user = await User.findOneById(user_id);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    await User.deleteOne({_id: user._id});

    res.status(statusCode.OK).json({
        message: "User deleted",
    })
}