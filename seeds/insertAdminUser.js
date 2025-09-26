const User = require("../models/user");

async function insertAdmin (options={create: true}) {
    const user = {
        name: "dummy-admin-user",
        email: "dummy-admin@mail.com",
        mobile_number: "9876543210",
        password: "dummy-password",
        role: "admin"
    };

    try {
        if (options.create) {
            const adminUser = await User.findOne({email: "dummy-admin@mail.com", role: "admin"});
            if (!adminUser) await User.insertOne(user);
            options.create = false;
        }
        console.log("Your admin credentials are: ");
        console.log({
            "email": user.email,
            "password": user.password,
        });
        console.warn("This is dummy admin user, make sure to add new admin and remove this dummy admin.");
    } catch (error) {
        console.log("Failed to create admin due to: ", error);
    }
}

module.exports = insertAdmin;