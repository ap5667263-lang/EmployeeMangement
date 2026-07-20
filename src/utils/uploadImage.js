const imagekit = require("../config/imagekit");

const uploadImage = async (file) => {
    if (!file) {
        return {
            url: process.env.DEFAULT_PROFILE_IMAGE,
            fileId: null,
        };
    }

    const response = await imagekit.files.upload({
        file: file.buffer,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: "/profile-image",
    });

    return {
        url: response.url,
        fileId: response.fileId,
    };
};

module.exports = uploadImage;
