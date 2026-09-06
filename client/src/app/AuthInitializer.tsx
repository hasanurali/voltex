import { useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useCurrentUser, authKeys } from "@/features/auth";
import { useAuthStore } from "@/store";
import { refreshAccessToken } from "@/lib/api";

const AuthInitializer = ({ children }: { children: ReactNode }) => {

    const { data, isError, isSuccess } = useCurrentUser();

    const setAuth = useAuthStore((state) => state.setAuth);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const queryClient = useQueryClient();

    useEffect(() => {

        if (isSuccess && data) {

            setAuth(data);
        } else if (isError) {

            refreshAccessToken().then(() => {

                queryClient.invalidateQueries({ queryKey: authKeys.me() });

            }).catch(() => {
                clearAuth();
            });
        };
    }, [isSuccess, isError, data, setAuth, clearAuth, queryClient]);

    return children;
};

export default AuthInitializer;