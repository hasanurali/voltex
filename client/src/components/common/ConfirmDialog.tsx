import { useEffect } from 'react';
import Button from './Button';


interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmLabel: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
};


const ConfirmDialog = ({ isOpen, title, description, confirmLabel, cancelLabel = 'Cancel', onConfirm, onCancel }: ConfirmDialogProps) => {

    useEffect(() => {

        if (!isOpen) {
            return;
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onCancel();
            };
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => document.removeEventListener('keydown', handleKeyDown);

    }, [isOpen, onCancel]);

    if (!isOpen) {
        return null;
    };

    return (
        <div onMouseDown={(e) => e.target === e.currentTarget && onCancel()} className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4' >
            <div onMouseDown={(e) => e.stopPropagation()} role='dialog' aria-modal='true' aria-labelledby='confirm-dialog-title' aria-describedby='confirm-dialog-description' className='w-full max-w-90 rounded-2xl bg-white p-6 shadow-xl'>

                <h2 className='text-xl font-bold text-neutral-950'>{title}</h2>
                <p className='mt-3 text-base leading-6 text-secondary-400'>{description}</p>

                <div className='mt-6 flex flex-col gap-3'>
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onConfirm();
                        }}
                        type='button'
                        className='h-12 w-full rounded-full! cursor-pointer bg-primary-950 text-white hover:bg-primary-800'
                    >
                        {confirmLabel}
                    </Button>

                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            onCancel();
                        }}
                        type='button'
                        variant='outline'
                        className='h-12 w-full rounded-full! cursor-pointer border-border bg-white hover:bg-neutral-50'
                    >
                        {cancelLabel}
                    </Button>
                </div>

            </div>
        </div >
    );
};

export default ConfirmDialog;