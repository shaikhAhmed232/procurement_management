const mongoose = require("mongoose");

const connectToDb = async () => {
    const mongoUrl = process.env.MONGODB_URL;
    try {
        await mongoose.connect(mongoUrl);
        console.log("Database connected");
    } catch (error) {   
        console.error("Fail to connect to database", error);
    }
}

const disconnectDb = async () => {
    try {
        await mongoose.disconnect();
    } catch (error) {
        console.error("Fail to disconnect database");
    }
}

module.exports = {connectToDb, disconnectDb};

