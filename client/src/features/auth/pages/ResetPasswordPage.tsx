import ResetPasswordForm from "../components/ResetPasswordForm";
import BackToSignIn from "../components/BackToSignIn";

const ResetPasswordPage = () => {
    return (
        <div className="min-h-screen bg-secondary-50 flex justify-center items-center max-[410px]:px-3 font-label">
            <div className="bg-white w-full max-w-98 p-[clamp(12px,1.38vw,20px)] flex flex-col justify-center gap-5 rounded-lg border border-neutral-200 shadow-2xl">

                <header className="flex flex-col items-center gap-5">

                    <div className="bg-secondary-100 rounded-full">
                        <span className="material-symbols-outlined text-4xl! rounded-full py-3 px-3.5" >
                            lock_reset
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <h1 className="text-2xl font-bold">Reset your password</h1>
                        <div className="text-secondary-600 text-sm text-center">
                            <p>Choose a strong password to secure your</p>
                            <p>account.</p>
                        </div>
                    </div>

                </header>

                <main>
                    <ResetPasswordForm />
                </main>

                <BackToSignIn />

            </div>
        </div>
    )
};

export default ResetPasswordPage;