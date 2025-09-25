const { Schema, model } = require("mongoose");
const { compare, genSalt, hash } = require("bcrypt");
const { signToken } = require("../lib/jwt");
const { userRoles } = require("../lib/constants");

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: () => this.role !== userRoles.INSPECTION_MANAGER,
    },
    mobile_number: {
        type: String,
        required: () => this.role === userRoles.INSPECTION_MANAGER,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "procurement_manager", "inspection_manager", "client"]
    },
    procurement_manager: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: () => this.role === "inspection_manager"
    }
}, {
    timestamps: true,
})

userSchema.pre("save", async function () {
    const saltRound = 10;
    const salt = await genSalt(saltRound);
    this.password = await hash(this.password, salt);
})

userSchema.methods.isValidPassword = async function (encryptedPassword, incomingPassword) {
    return await compare(incomingPassword, encryptedPassword);
}

userSchema.methods.generateJwt = function () {
    const jwtPayload = {
        _id: this._id,
        email: this.email,
        mobile_number: this.mobile_number,
        role: this.role,
    };
    const token = signToken(jwtPayload);
    return token;
}

const User = model('User', userSchema);

module.exports = User;

