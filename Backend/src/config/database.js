const mongoose = require("mongoose");
const config = require("./config");

const connectDb = async () => {
    try {
        await mongoose.connect(config.MONGO_URI);
        console.log("Mongodb is connected.....");
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
};

module.exports = connectDb;
