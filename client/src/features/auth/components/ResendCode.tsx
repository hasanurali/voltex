import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components';
import { useResendOtp } from '../hooks/useResendOtp';
import { getSessionItem } from '@/utils';
import { AUTH_SESSION_KEYS } from '../sessionKeys';
import { ROUTES } from '@/app/routes';

const ResendCode = () => {

    const [resendTimer, setResendTimer] = useState(59);

    const navigate = useNavigate();

    useEffect(() => {

        const timer = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(timer);

    }, []);

    const { mutate: resendOtpMutate, isPending: isResendOtpPending } = useResendOtp()
    const handleResendCode = () => {

        if (resendTimer) {
            return;
        };

        const email = getSessionItem<string>(AUTH_SESSION_KEYS.pendingVerificationEmail);
        if (!email) {
            navigate(ROUTES.login, { replace: true });
            // toast
            return;
        };

        resendOtpMutate({ email });
        setResendTimer(59);
    };

    return (
        <Button onClick={handleResendCode} disabled={isResendOtpPending || !!resendTimer} type="button" variant="ghost" size="lg" className="group w-full rounded-full! cursor-pointer">
            <RefreshCw color='gray' size={23} className="translate-y-[0.5px] group-hover:rotate-180 transition-all duration-500" />
            <span className='text-secondary-400'>
                {
                    resendTimer <= 0 ?
                        'Resend code'
                        :
                        <span>
                            Resend code in
                            {' '}
                            <span className='text-primary-950 tabular-nums'>{`0:${resendTimer}`}</span>
                        </span>
                }
            </span>
        </Button>
    );
};

export default ResendCode;