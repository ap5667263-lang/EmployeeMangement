const sendVerificationEmail = async (email, token) => {
    console.log(`[mock email] Verification token for ${email}: ${token}`);
    return true;
};

module.exports = { sendVerificationEmail };
