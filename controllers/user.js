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
    let { uniqueId, password } = req.body;
    const user = await User.findOne({
        $or: [
            {email: uniqueId || ''},
            {mobile_number: uniqueId || ''}
        ]
    }).select('email mobile_number password role');
    if (!user) {
        throw new BadRequestError('Invalid credentials')
    }
    if (rolesAllowedWithEmail.includes(user.role) && uniqueId !== user.email) {
        throw new BadRequestError("Please use your email to login");
    }
    if (rolesAllowedWithMobile.includes(user.role) && uniqueId !== user.mobile_number) {
        throw new BadRequestError("Please use you phone number to login");
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
    const {user_type = "inspection_manager"} = req.query;
    const query = {};
    query["role"] = user_type;
    if (req.user.role === userRoles.PROCUREMENT_MANAGER) {
        if (query.role !== userRoles.CLIENT) {
            query["role"] = userRoles.INSPECTION_MANAGER;
            query["procurement_manager"] = req.user._id;
        }
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