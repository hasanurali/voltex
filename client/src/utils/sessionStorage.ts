export function setSessionItem<T>(key: string, value: T): void {
    try {

        sessionStorage.setItem(key, JSON.stringify(value));

    } catch {
        // sessionStorage should be unavailable — fail silently
    };
};

export function getSessionItem<T>(key: string): T | null {
    try {

        const item = sessionStorage.getItem(key);

        return item ? (JSON.parse(item) as T) : null;

    } catch {
        return null;
    };
};

export function removeSessionItem(key: string): void {
    try {

        sessionStorage.removeItem(key);

    } catch {
        // ignore
    };
};