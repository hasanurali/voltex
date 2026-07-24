const otpGenerator = () => {
    const otp = Math.floor((Math.random() * 900000) + 100000);
    return otp;
}

export default otpGenerator;