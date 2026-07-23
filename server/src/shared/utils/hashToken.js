import crypto from "crypto"

const hashToken = (token) => {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    return hashedToken;
};

export default hashToken;