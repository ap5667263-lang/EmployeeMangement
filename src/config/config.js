const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI not exists");
}

if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not Exist");
}

if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error("JWT_REFRESH_SECRET is not Exist");
}

if (!process.env.DEFAULT_PROFILE_IMAGE) {
    throw new Error("DEFAULT_PROFILE_IMAGE is not Exist");
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    DEFAULT_PROFILE_IMAGE: process.env.DEFAULT_PROFILE_IMAGE,
};

module.exports = config;
