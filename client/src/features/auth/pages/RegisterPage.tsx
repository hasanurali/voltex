import { Link } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import { ROUTES } from '@/app/routes';

const RegisterPage = () => {
    return (
        <div className="min-h-screen bg-secondary-50 flex flex-col justify-center items-center gap-[clamp(16px,1.3vw,20px)] max-[410px]:px-3 py-3 font-label">

            <header className="flex flex-col items-center">
                <h1 className="text-3xl sm:text-4xl font-bold">Join Voltex</h1>
                <p className="text-secondary-600 text-sm sm:text-[15px]">Enter your details to create an account</p>
            </header>

            <main className="w-full max-w-98">

                <RegisterForm />

            </main>

            <footer className="text-secondary-600 text-[clamp(15px,4vw,16px)]">
                Already have an account?
                {' '}
                <Link to={ROUTES.login} className="text-primary-950 font-bold cursor-pointer">Sign In</Link>
            </footer>

        </div>
    );
};

export default RegisterPage;
