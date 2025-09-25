const { Schema, model } = require("mongoose");

const roleSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unqiue: true,
    },
    description: {
        type: String,
    },
}, {
    timestamps: true,
})

const Role = model('Role', roleSchema);
module.exports = Role;