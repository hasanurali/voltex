interface NotificationSettingCardProps {
    notificationInfo: {
        key: string,
        label: string
    };
    isChecked: boolean;
    onNotificationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const NotificationSettingCard = ({ notificationInfo, isChecked, onNotificationChange }: NotificationSettingCardProps) => {

    const { key, label } = notificationInfo;
    const id = `notification-${key}`

    return (
        <>
            <label htmlFor={id} className="text-xs font-medium text-primary-900">
                {label}
            </label>
            <label className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center">
                <input
                    id={id}
                    type="checkbox"
                    role="switch"
                    checked={isChecked}
                    onChange={onNotificationChange}
                    className="peer sr-only"
                />
                <span className="absolute inset-0 rounded-full bg-secondary-300 transition-colors peer-checked:bg-primary-950 peer-disabled:cursor-wait peer-disabled:opacity-60 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-700" />
                <span className="absolute left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-4" />
            </label>

        </>
    )
}

export default NotificationSettingCard;