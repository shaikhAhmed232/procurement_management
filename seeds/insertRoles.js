const Role = require("../models/role");

const roles = [
    {
        _id: "admin",
        description: "Have every right"
    },
    {
        _id: "procurement_manager",
        description: "Can create client and Inspection manager, allowed to create checklist"
    },
    {
        _id: "inspection_manager",
        description: "Fill the checklist"
    },
    {
        _id: "client",
        description: "Give order requirements",
    }
];


async function seedRole() {
    try {
        const documents = roles.map((doc) => {
            return {
                updateOne: {
                    filter: {
                        _id: doc._id
                    },
                    update: {
                        $set: {_id: doc._id, description: doc.description}
                    },
                    upsert: true,
                }
            }
        });
        await Role.bulkWrite(documents);
    } catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = seedRole;