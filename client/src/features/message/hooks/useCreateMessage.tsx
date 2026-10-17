import { useMutation } from "@tanstack/react-query";
import { createMessage } from "../api/messageApi";

export const useCreateMessage = () => {
    return useMutation({
        mutationFn: createMessage
    });
};