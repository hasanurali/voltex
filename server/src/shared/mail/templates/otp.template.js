const otpTemplate = ({ name, otp, expiry }) => {
    return `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
</head>

<body style="margin:0; padding:0; background:#f4f4f5; font-family:Arial,Helvetica,sans-serif;">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px;">
        <tr>
            <td align="center">

                <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                    style="background:#ffffff; border-radius:12px; overflow:hidden;">

                    <tr>
                        <td style="background:#111827; padding:30px; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:28px;">
                                Social Media
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:40px;">

                            <h2 style="margin:0 0 20px; color:#111827;">
                                Verify Your Email
                            </h2>

                            <p style="color:#4b5563; font-size:16px; line-height:26px;">
                                Hello <strong>${name}</strong>,
                            </p>

                            <p style="color:#4b5563; font-size:16px; line-height:26px;">
                                Use the verification code below to complete your email verification.
                            </p>

                            <div style="text-align:center; margin:35px 0;">
                                <div
                                    style="display:inline-block; padding:16px 36px; background:#111827; 
                                 color:#ffffff; font-size:34px; font-weight:bold; letter-spacing:8px; border-radius:8px;">
                                    ${otp}
                                </div>
                            </div>

                            <p style="color:#4b5563; font-size:15px; line-height:24px;">
                                This OTP is valid for <strong>${expiry}</strong>.
                            </p>

                            <p style="color:#4b5563; font-size:15px; line-height:24px;">
                                If you didn't request this code, you can safely ignore this email.
                            </p>

                        </td>
                    </tr>

                    <tr>
                        <td style="padding:25px; text-align:center; background:#f9fafb; border-top:1px solid #e5e7eb;">

                            <p style="margin:0; font-size:13px; color:#6b7280;">
                                © 2026 Social Media. All rights reserved.
                            </p>

                            <p style="margin-top:8px; font-size:12px; color:#9ca3af;">
                                This is an automated email. Please do not reply.
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>`
};

export default otpTemplate;