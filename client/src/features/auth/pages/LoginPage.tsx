import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { ROUTES } from "@/app/routes";
import { removeSessionItem } from "@/utils";
import { AUTH_SESSION_KEYS } from "../sessionKeys";

const LoginPage = () => {
    return (
        <div className="min-h-screen bg-secondary-50 flex flex-col justify-center items-center gap-[clamp(25px,2.2vw,32px)] max-[410px]:px-3 font-label">

            <header className="flex flex-col items-center">
                <h1 className="text-3xl font-bold">Voltex</h1>
                <p className="text-secondary-600 text-[15px]">Premium Social Experience</p>
            </header>

            <main className="bg-white w-full max-w-98 p-[clamp(12px,1.38vw,20px)] flex flex-col justify-center gap-5 rounded-lg border border-neutral-200 shadow-2xl">

                <div className="px-3">
                    <h2 className="text-xl font-medium">Welcome back</h2>
                    <p className="text-secondary-600 text-sm">Please enter your details to sign in.</p>
                </div>

                <LoginForm />

            </main>

            <footer className="text-secondary-600 text-[clamp(15px,4vw,16px)]">
                Don't have an account?
                {' '}
                <Link to={ROUTES.register} onClick={() => removeSessionItem(AUTH_SESSION_KEYS.loginDraftEmail)} className="text-primary-950 font-bold cursor-pointer">Create account</Link>
            </footer>

        </div>
    );
};

export default LoginPage;
