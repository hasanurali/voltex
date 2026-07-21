import { Resend } from "resend";

import MAIL_CONFIG from "../../config/mail.js";

const resend = new Resend(MAIL_CONFIG.KEY);

export default resend;