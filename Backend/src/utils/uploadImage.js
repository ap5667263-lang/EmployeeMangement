const imagekit = require("../config/imagekit");

const uploadImage = async (file) => {
    if (!file) {
        return {
            url: process.env.DEFAULT_PROFILE_IMAGE || "",
            fileId: null,
        };
    }

    // @imagekit/nodejs v7 requires base64 string or Blob, not raw Buffer
    const base64 = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    const response = await imagekit.files.upload({
        file: dataUri,
        fileName: `${Date.now()}-${file.originalname}`,
        folder: "/profile-image",
    });

    return {
        url: response.url,
        fileId: response.fileId,
    };
};

module.exports = uploadImage;
