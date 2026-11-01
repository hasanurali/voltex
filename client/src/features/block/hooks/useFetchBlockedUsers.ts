import { useQuery } from "@tanstack/react-query";
import { blockKeys } from "../api/blockKeys";
import { fetchBlockedUsers } from "../api/blockApi";

export const useFetchBlockedUsers = () => {
    return useQuery({
        queryKey: blockKeys.fetchBlockedUsers(),
        queryFn: fetchBlockedUsers
    });
};