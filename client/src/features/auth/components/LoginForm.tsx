import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { isAxiosError } from 'axios';
import { Button, Input } from '@/components';
import { loginSchema, type LoginFormValues } from '../schemas/authSchema';
import { useLoginUser } from '../hooks/useLoginUser';
import { fieldApiError, setSessionItem, getSessionItem } from '@/utils';
import { ROUTES } from '@/app/routes';
import { useDebounce } from '@/hooks';
import { AUTH_SESSION_KEYS } from '../sessionKeys';

const LoginForm = () => {

    const navigate = useNavigate();

    const { register, handleSubmit, setError, control, setValue, formState: { errors } } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema)
    });

    const watchedEmail = useWatch({ control, name: 'email' });
    const debouncedValue = useDebounce(watchedEmail, 500);

    useEffect(() => {

        if (debouncedValue) {
            setSessionItem(AUTH_SESSION_KEYS.loginDraftEmail, debouncedValue);
        };
    }, [debouncedValue]);

    useEffect(() => {

        const email: string | null = getSessionItem(AUTH_SESSION_KEYS.loginDraftEmail);
        if (email) {
            setValue('email', email);
        };
    }, []);

    const { mutate: loginUserMutate, isPending: isLoginUserPending } = useLoginUser();
    const onSubmit = (formValue: LoginFormValues) => {
        loginUserMutate(formValue, {
            onError: (error) => {

                if (isAxiosError(error) && error.response?.status === 403) {
                    setSessionItem(AUTH_SESSION_KEYS.pendingVerificationEmail, formValue.email);
                    navigate(ROUTES.verifyEmail, { replace: true });
                    return;
                };

                fieldApiError(error, setError);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-3">

            {/* Inputs wrapper */}
            <div className="flex flex-col gap-5">

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-primary-700 font-label text-[15px] tracking-[0.2px]">Email address</label>
                    <Input {...register('email')} error={errors.email?.message} id="email" type="text" placeholder="name@example.com" className={`py-3 px-4 bg-neutral-50 focus:bg-white ${!errors.email && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-label text-[15px] tracking-[0.2px]">
                        <label htmlFor="password" className="text-primary-700 ">Password</label>
                        <Link to={ROUTES.forgotPassword} className="text-primary-800 font-medium">Forgot password?</Link>
                    </div>
                    <Input {...register('password')} error={errors.password?.message} id="password" type="password" showPasswordToggle={true} placeholder="••••••••" className={`py-3 px-3 bg-neutral-50 focus:bg-white  ${!errors.password && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                </div>

            </div>

            {/* Submit button */}
            <Button type="submit" size="lg" loading={isLoginUserPending} disabled={isLoginUserPending} className="w-full cursor-pointer">
                {isLoginUserPending ? 'Signing in...' : 'Sign in'}
            </Button>

        </form>
    )
}

export default LoginForm;