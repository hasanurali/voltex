import { Link } from "react-router-dom";
import { MailCheck, Pencil } from "lucide-react";
import VerifyEmailForm from "../components/VerifyEmailForm";
import { ROUTES } from "@/app/routes";
import { removeSessionItem } from "@/utils";
import { AUTH_SESSION_KEYS } from "../sessionKeys";


const VerifyEmailPage = () => {
    return (
        <div className="min-h-screen bg-secondary-50 flex flex-col justify-center items-center gap-[clamp(25px,2.2vw,32px)] max-[410px]:px-2 max-[340px]:px-0 font-label">
            <div className="bg-white w-full max-w-98 py-[clamp(12px,1.38vw,20px)] min-[375px]:px-[clamp(2px,0.35vw,6px)] flex flex-col justify-center gap-5 rounded-lg border border-neutral-200 shadow-2xl">

                <header className="flex flex-col items-center gap-5">

                    <div className="bg-secondary-100 p-5 rounded-full">
                        <MailCheck size={35} />
                    </div>

                    <div className="flex flex-col items-center">
                        <h1 className="text-2xl font-bold">Check your inbox</h1>
                        <p className="text-secondary-600 text-[15px]">Enter the 6-digit code sent to your email</p>
                    </div>

                </header>

                <main>
                    <VerifyEmailForm />
                </main>

                <footer className="text-secondary-600 text-[clamp(15px,4vw,16px)] flex flex-col items-center gap-3">

                    <div className="w-50 h-px bg-neutral-200 mx-auto mask-[radial-gradient(ellipse_at_center,black_0%,transparent_70%)]"></div>

                    <Link to={ROUTES.login} onClick={() => removeSessionItem(AUTH_SESSION_KEYS.pendingVerificationEmail)} className="flex items-center gap-2 text-sm cursor-pointer">
                        <Pencil size={16} />
                        Change email address
                    </Link>

                </footer>

            </div>
        </div>
    )
}

export default VerifyEmailPage;