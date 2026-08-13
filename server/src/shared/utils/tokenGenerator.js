import crypto from "crypto";

const tokenGenerator = () => {

    const token = crypto.randomBytes(32).toString("hex");

    return token;
}

export default tokenGenerator;