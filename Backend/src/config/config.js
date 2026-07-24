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

// ImageKit checks
if (!process.env.IMAGEKIT_PUBLIC_KEY) {
    throw new Error("IMAGEKIT_PUBLIC_KEY is not Exist");
}

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not Exist");
}

if (!process.env.IMAGEKIT_URL_ENDPOINT) {
    throw new Error("IMAGEKIT_URL_ENDPOINT is not Exist");
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    DEFAULT_PROFILE_IMAGE: process.env.DEFAULT_PROFILE_IMAGE,

    // ImageKit
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT,
};

module.exports = config;