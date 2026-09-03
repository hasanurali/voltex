import { useEffect } from "react";
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from "lucide-react";
import { Button, Input } from "@/components";
import { registerSchema, type RegisterFormValues } from '../schemas/authSchema';
import { useRegisterUser } from '../hooks/useRegisterUser';
import { fieldApiError, setSessionItem, getSessionItem } from '@/utils';
import { useDebounce } from '@/hooks';
import { AUTH_SESSION_KEYS } from '../sessionKeys';


interface RegisterDraftValues {
    displayName: string,
    username: string,
    email: string
};


const RegisterForm = () => {

    const { register, handleSubmit, setError, control, setValues, formState: { errors } } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema)
    });

    const watchedFields = useWatch({
        control,
        name: ['displayName', 'username', 'email']
    });
    const debouncedValue = useDebounce(watchedFields, 500);

    useEffect(() => {

        if (debouncedValue.filter(Boolean).length) {
            const [displayName, username, email] = debouncedValue;
            const draftValues: RegisterDraftValues = { displayName, username, email };

            setSessionItem(AUTH_SESSION_KEYS.registerDraftValues, draftValues);
        };
    }, [debouncedValue]);

    useEffect(() => {

        const draftValues: RegisterDraftValues | null = getSessionItem(AUTH_SESSION_KEYS.registerDraftValues);
        if (draftValues) {

            const { displayName, username, email } = draftValues;
            setValues({ displayName, username, email });
        };
    }, []);

    const { mutate: registerUserMutate, isPending: isRegisterPending } = useRegisterUser();
    const onSubmit = (formValue: RegisterFormValues) => {
        registerUserMutate(formValue, {
            onError: (error) => {
                fieldApiError(error, setError);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-7 p-3">

            {/* Inputs wrapper */}
            <div className="flex flex-col gap-5">

                {/* Display name */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="display-name" className="text-primary-700 font-label text-[15px] tracking-[0.2px]">Full name</label>
                    <Input {...register('displayName')} error={errors.displayName?.message} id="display-name" type="text" placeholder="e.g. Jhon Doe" className={`py-3 px-4 bg-neutral-50 focus:bg-white ${!errors.displayName && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                </div>

                {/* Username */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="text-primary-700 font-label text-[15px] tracking-[0.2px]">Username</label>
                    <Input {...register('username')} error={errors.username?.message} id="username" type="text" placeholder="e.g. jhondoe9" className={`py-3 px-4 bg-neutral-50 focus:bg-white ${!errors.username && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-primary-700 font-label text-[15px] tracking-[0.2px]">Email address</label>
                    <Input {...register('email')} error={errors.email?.message} id="email" type="text" placeholder="name@example.com" className={`py-3 px-4 bg-neutral-50 focus:bg-white ${!errors.email && 'focus:border-primary-800'} placeholder:text-neutral-400 focus:placeholder:text-neutral-500`} />
                </div>

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
            <Button type="submit" loading={isRegisterPending} disabled={isRegisterPending} size="lg" className="group w-full cursor-pointer">
                {isRegisterPending ? 'Creating account...' : 'Create account'}
                {!isRegisterPending && <ArrowRight className="translate-y-[1.6px] group-hover:translate-x-1 transition-all duration-100" />}
            </Button>

        </form>
    );
};

export default RegisterForm;
