import { useCurrentUser } from "@/features/auth";
import { useAuthStore } from "@/store";
import { useEffect, type ReactNode } from "react";

const AuthInitializer = ({ children }: { children: ReactNode }) => {

    const { data, isError, isSuccess } = useCurrentUser();

    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {

        if (isSuccess && data) {

            setAuth(data);
        } else if (isError) {

            clearAuth();
        };
    }, [isSuccess, isError, data, setAuth, clearAuth]);

    return children;
}

export default AuthInitializer;