import type { Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '../schemas/authSchema';
import { fieldApiError } from '@/utils';
import { useForgotPassword } from '../hooks/useForgotPassword';


interface ForgotPasswordFormProps {
    onSuccess: Dispatch<SetStateAction<string | null>>
};


const ForgotPasswordForm = ({ onSuccess }: ForgotPasswordFormProps) => {

    const { register, handleSubmit, setError, formState: { errors } } = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema)
    });

    const { mutate: forgotPasswordMutate, isPending: isForgotPasswordPending } = useForgotPassword();
    const onSubmit = (formValue: ForgotPasswordFormValues) => {
        forgotPasswordMutate(formValue, {
            onSuccess: () => {
                onSuccess(formValue.email);
            },
            onError: (error) => {
                fieldApiError(error, setError);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-3">

            {/* Email */}
            <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-primary-700 font-label text-[15px] tracking-[0.2px]">Email address</label>
                <Input {...register('email')} error={errors.email?.message} id="email" type="text" placeholder="name@example.com" className={`py-3 px-4 bg-neutral-50 focus:bg-white ${!errors.email && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
            </div>

            {/* Submit button */}
            <Button type="submit" size="lg" loading={isForgotPasswordPending} disabled={isForgotPasswordPending} className="group w-full cursor-pointer">
                {isForgotPasswordPending ? 'Sending...' : 'Send reset link'}
                {!isForgotPasswordPending && <ArrowRight className="translate-y-px group-hover:translate-x-1 transition-all duration-100" />}
            </Button>

        </form>
    )
};

export default ForgotPasswordForm;