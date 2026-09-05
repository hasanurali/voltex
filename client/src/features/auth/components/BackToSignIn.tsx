import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { ROUTES } from "@/app/routes";

const BackToSignIn = () => {
    return (
        <footer className="text-secondary-600 text-[clamp(15px,4vw,16px)] flex flex-col items-center gap-3">

            <div className="w-50 h-px bg-neutral-200 mx-auto mask-[radial-gradient(ellipse_at_center,black_0%,transparent_70%)]"></div>

            <Link to={ROUTES.login} className="group flex items-center gap-2 text-sm cursor-pointer">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-all duration-100" />
                Back to sign in
            </Link>

        </footer>
    );
};

export default BackToSignIn;