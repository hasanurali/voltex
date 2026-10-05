const timeConverter = (time: string): string => {

    const past = new Date(time).getTime();
    const now = Date.now();

    if (isNaN(past)) {
        return "Invalid date";
    };

    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) {
        return "just now";
    };

    const dateMarks = [
        { label: 'y', seconds: 31536000 },
        { label: 'mo', seconds: 2592000 },
        { label: 'w', seconds: 604800 },
        { label: 'd', seconds: 86400 },
        { label: 'h', seconds: 3600 },
        { label: 'm', seconds: 60 }
    ];

    for (const dateMark of dateMarks) {

        const count = Math.floor(diffInSeconds / dateMark.seconds);
        if (count >= 1) {
            return `${count}${dateMark.label} ago`;
        };
    };

    return "just now";
};

export default timeConverter;