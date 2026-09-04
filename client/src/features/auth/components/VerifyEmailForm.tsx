import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight } from 'lucide-react';
import { verifyEmailSchema, type VerifyEmailFormValues } from '../schemas/authSchema';
import { useVerifyEmail } from '../hooks/useVerifyEmail';
import { fieldApiError, getSessionItem } from '@/utils';
import { Button, Input } from '@/components';
import { ROUTES } from '@/app/routes';
import { AUTH_SESSION_KEYS } from '../sessionKeys';
import ResendCode from './ResendCode';


const VerifyEmailForm = () => {

    const navigate = useNavigate();
    const otpInputRefs = useRef<Map<number, HTMLInputElement>>(new Map());
    const otpLength = Array.from({ length: 6 }, (_, i) => i + 1);


    const { control, handleSubmit, setError, formState: { errors } } = useForm<VerifyEmailFormValues>({
        resolver: zodResolver(verifyEmailSchema),
        defaultValues: { otp: ' '.repeat(6) }
    });

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

        const currentKey = Number(e.currentTarget.dataset.key);

        if (e.key === 'ArrowLeft' && currentKey > 1) {

            const input = otpInputRefs.current.get(currentKey);
            if (input && !input.selectionStart) {

                otpInputRefs.current.get(currentKey - 1)?.focus();
            };
        }
        else if (e.key === 'ArrowRight' && currentKey < 6) {

            const input = otpInputRefs.current.get(currentKey);
            if (input && input.selectionStart) {

                otpInputRefs.current.get(currentKey + 1)?.focus();
            };
        }
        else if ((e.key === 'Backspace' || e.key === 'Delete') && currentKey > 1 && !e.currentTarget.value) {
            otpInputRefs.current.get(currentKey - 1)?.focus();
        };
    };

    const { mutate: verifyEmailMutate, isPending: isVerifyEmailPending } = useVerifyEmail();
    const onSubmit = (formValue: VerifyEmailFormValues) => {

        const email = getSessionItem<string>(AUTH_SESSION_KEYS.pendingVerificationEmail);

        if (!email) {
            navigate(ROUTES.login, { replace: true });
            //toast
            return;
        };

        verifyEmailMutate({ email, otp: formValue.otp }, {
            onError: (error) => {
                fieldApiError(error, setError);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-[clamp(8px,2vw,12px)]">

            <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                    <div className="flex gap-[clamp(5px,2vw,12px)] m-auto">
                        {otpLength.map((item) => {

                            const index = item - 1;

                            return (
                                <Input
                                    key={item}
                                    data-key={item}
                                    value={field.value[index]?.trim() ?? ''}
                                    onChange={(e) => {

                                        const digit = e.target.value.replace(/\D/g, '').slice(-1);
                                        if (!digit && e.target.value) {
                                            return;
                                        };

                                        const charToInsert = digit || ' ';
                                        const newValue = field.value.slice(0, index) + charToInsert + field.value.slice(index + 1);

                                        field.onChange(newValue);

                                        if (digit && index < 5) {
                                            otpInputRefs.current.get(item + 1)?.focus();
                                        };
                                    }}
                                    onKeyDown={handleKeyDown}
                                    onPaste={(e) => {

                                        e.preventDefault();

                                        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                                        const newValue = (pasted + ' '.repeat(6)).slice(0, 6);

                                        field.onChange(newValue);

                                        const lastFilledIndex = pasted.length - 1;
                                        if (lastFilledIndex >= 0) {
                                            otpInputRefs.current.get(lastFilledIndex + 1)?.focus();
                                        };
                                    }}
                                    ref={(elm: HTMLInputElement) => {
                                        if (elm) {
                                            otpInputRefs.current.set(item, elm);
                                        }
                                        else {
                                            otpInputRefs.current.delete(item);
                                        };
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]"
                                    maxLength={1}
                                    className="w-11.25 h-11.25 font-label text-2xl text-center bg-neutral-100 focus:bg-transparent focus:border-primary-800"
                                />
                            );
                        })}
                    </div>
                )}
            />

            {/* error container */}
            <div className={`grid transition-all duration-200 ease-out ${errors.otp ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <span className="text-center text-[13px] text-danger block leading-tight">
                        {errors.otp?.message}
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-3">

                <Button type="submit" loading={isVerifyEmailPending} disabled={isVerifyEmailPending} size="lg" className="group w-full rounded-full! cursor-pointer" >
                    {isVerifyEmailPending ? 'Verifying...' : 'Verify and continue'}
                    {!isVerifyEmailPending && <ArrowRight className="translate-y-[1.6px] group-hover:translate-x-1 transition-all duration-100" />}
                </Button>

                <ResendCode />

            </div>
        </form>
    );
};

export default VerifyEmailForm;