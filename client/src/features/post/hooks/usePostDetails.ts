import { useQuery } from "@tanstack/react-query";
import { fetchPostDetails } from "../api/postApi";
import { postKeys } from "../api/postKeys";

export const usePostDetails = (postId: string | null) => {

    if(!postId){
        return;
    };

    return useQuery({
        queryKey: postKeys.details(postId),
        queryFn: () => fetchPostDetails(postId),
        enabled: !!postId
    });
};