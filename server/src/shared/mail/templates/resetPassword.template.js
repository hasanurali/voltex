const resetPasswordTemplate = ({ name, resetLink, expiry }) => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password</title>
</head>

<body style="margin:0; padding:0; background:#f4f4f5; font-family:Arial,Helvetica,sans-serif; color:#18181b; ">

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:40px 20px; ">
        <tr>
            <td align="center">

                <table role="presentation" width="600" cellspacing="0" cellpadding="0"
                    style="background:#ffffff; border-radius:16px; padding:40px; box-shadow:0 8px 24px rgba(0,0,0,.08); ">

                    <tr>
                        <td align="center">
                            <h1 style="margin:0; font-size:28px; color:#111827; ">
                                Reset Your Password
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-top:28px; font-size:16px; line-height:28px; color:#374151; ">
                            Hi <strong>${name}</strong>,
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-top:16px; font-size:16px; line-height:28px; color:#4b5563; ">
                            We received a request to reset the password for your account.
                            Click the button below to create a new password.
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding:36px 0; ">
                            <a href="${resetLink}"
                                style="
                                    display:inline-block; 
                                    padding:14px 32px; 
                                    background:#111827; 
                                    color:#ffffff; 
                                    text-decoration:none; 
                                    border-radius:10px; 
                                    font-size:16px; 
                                    font-weight:600; 
                                ">
                                Reset Password
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td style="font-size:15px; color:#6b7280; line-height:26px; ">
                            This password reset link will expire in
                            <strong>${expiry}</strong>.
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-top:18px; font-size:15px; color:#6b7280; line-height:26px; ">
                            If you didn't request a password reset, you can safely ignore this email.
                            Your password will remain unchanged.
                        </td>
                    </tr>

                    <tr>
                        <td style="padding-top:32px; border-top:1px solid #e5e7eb; font-size:13px; color:#9ca3af; line-height:22px; ">
                            If the button above doesn't work, copy and paste this link into your browser:
                            <br><br>
                            <a href="${resetLink}" style="color:#2563eb; word-break:break-all; ">
                                ${resetLink}
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td align="center"
                            style="padding-top:36px; font-size:13px; color:#9ca3af; ">
                            © ${new Date().getFullYear()} Voltex. All rights reserved.
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`
};

export default resetPasswordTemplate; 