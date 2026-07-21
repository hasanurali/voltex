const AUTH_MESSAGES = Object.freeze({
    REGISTER_SUCCESS: "Registration successful.",
    LOGIN_SUCCESS: "Login successful.",
    LOGOUT_SUCCESS: "Logout successful.",

    UNABLE_TO_SEND_OTP: "Unable to send OTP. Please try again later.",
    VERIFICATION_SESSION_EXPIRED: "Verification session expired. Please login again.",
    EMAIL_VERIFIED: "Email verified successfully",
    EMAIL_ALREADY_VERIFIED: "Email already verified",

    INVALID_CREDENTIALS: "Invalid email or password.",
    INVALID_OTP: "Invalid OTP.",
});

export default AUTH_MESSAGES;