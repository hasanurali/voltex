import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { Button, Input } from '@/components';
import { resetPasswordSchema, type ResetPasswordFormValues } from '../schemas/authSchema';
import { fieldApiError } from '@/utils';
import { useResetPassword } from '../hooks/useResetPassword';
import { ROUTES } from '@/app/routes';

const ResetPasswordForm = () => {

    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const { register, handleSubmit, setError, formState: { errors } } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema)
    });

    const { mutate: resetPasswordMutate, isPending: isResetPasswordPending } = useResetPassword();
    const onSubmit = (formValue: ResetPasswordFormValues) => {

        const token: string | null = searchParams.get('token');
        if (!token) {
            navigate(ROUTES.forgotPassword, { replace: true });
            // toast
            return;
        };

        resetPasswordMutate({ token, ...formValue }, {
            onError: (error) => {
                fieldApiError(error, setError);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-3">

            {/* Inputs wrapper */}
            <div className="flex flex-col gap-5">

                {/* Password */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-label text-[15px] tracking-[0.2px]">
                        <label htmlFor="password" className="text-primary-700 ">Password</label>
                    </div>
                    <Input {...register('password')} error={errors.password?.message} id="password" type="password" showPasswordToggle={true} placeholder="••••••••" className={`py-3 px-3 bg-neutral-50 focus:bg-white ${!errors.password && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1">
                    <div className="flex justify-between font-label text-[15px] tracking-[0.2px]">
                        <label htmlFor="confirm-password" className="text-primary-700 ">Confirm Password</label>
                    </div>
                    <Input {...register('confirmPassword')} error={errors.confirmPassword?.message} id="confirm-password" type="password" showPasswordToggle={true} placeholder="••••••••" className={`py-3 px-3 bg-neutral-50 focus:bg-white ${!errors.confirmPassword && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                </div>

            </div>

            {/* Submit button */}
            <Button type="submit" size="lg" loading={isResetPasswordPending} disabled={isResetPasswordPending} className="group w-full cursor-pointer">
                {isResetPasswordPending ? 'Resetting...' : 'Reset password'}
                {!isResetPasswordPending && <ArrowRight className="translate-y-px group-hover:translate-x-1 transition-all duration-100" />}
            </Button>

        </form>
    )
}

export default ResetPasswordForm
