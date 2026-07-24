import crypto from "crypto";

const resetPasswordTokenGenerator = () => {

    const token = crypto.randomBytes(32).toString("hex");

    return token;
}

export default resetPasswordTokenGenerator;