import { useMutation } from "@tanstack/react-query";
import { deleteMessage } from "../api/messageApi";

export const useDeleteMessage = () => {
    return useMutation({
        mutationFn: deleteMessage
    });
};