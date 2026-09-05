import { useState } from "react";
import { ExternalLink, MailCheck } from "lucide-react";
import ForgotPasswordForm from "../components/ForgotPasswordForm";
import { Button } from "@/components";
import BackToSignIn from "../components/BackToSignIn";

const ForgotPasswordPage = () => {

    const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-secondary-50 flex justify-center items-center max-[410px]:px-3 font-label">
            <div className="bg-white w-full max-w-98 p-[clamp(12px,1.38vw,20px)] flex flex-col justify-center gap-5 rounded-lg border border-neutral-200 shadow-2xl">

                <header className="flex flex-col items-center gap-5">

                    {submittedEmail ?
                        <div className="bg-secondary-100 p-5 rounded-full">
                            <MailCheck size={35} />
                        </div>
                        :
                        <div className="bg-secondary-100 rounded-full">
                            <span className="material-symbols-outlined text-4xl! rounded-full py-3 px-3.5" >
                                lock_reset
                            </span>
                        </div>
                    }

                    <div className="flex flex-col items-center gap-2">
                        {submittedEmail ?
                            <>
                                <h1 className="text-2xl font-bold">Check your email</h1>
                                <div className="text-secondary-600 text-sm text-center">
                                    <p>We've sent a password reset link to</p>
                                    <p><span className="text-primary-950 font-bold">{submittedEmail && submittedEmail}</span>. Click the link inside to</p>
                                    <p>set a new password.</p>
                                </div>
                            </>
                            :
                            <>
                                <h1 className="text-2xl font-bold">Forgot password?</h1>
                                <div className="text-secondary-600 text-sm text-center">
                                    <p>Enter your email address and we'll send</p>
                                    <p>you a link to reset your password.</p>
                                </div>
                            </>
                        }
                    </div>

                </header>

                <main>
                    {submittedEmail ?
                        <section className="flex flex-col gap-3 p-3">
                            <a href="mailto:">
                                <Button size="lg" className="w-full rounded-full! cursor-pointer">
                                    Open email app
                                    {' '}
                                    <ExternalLink />
                                </Button>
                            </a>
                            <p className="text-secondary-600 text-sm text-center">Didn't receive the email? Check your spam folder or resend link</p>
                        </section>
                        :
                        <ForgotPasswordForm onSuccess={setSubmittedEmail} />
                    }
                </main>

                <BackToSignIn />

            </div>
        </div>
    )
};

export default ForgotPasswordPage;