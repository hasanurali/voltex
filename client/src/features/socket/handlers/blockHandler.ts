import type { QueryClient } from '@tanstack/react-query';
import { profileKeys } from '@/features/profile';
import { followKeys } from '@/features/follow/api/followKeys';
import { conversationKeys } from '@/features/conversation';

export const handleBlockChanged = (queryClient: QueryClient) => {
    queryClient.invalidateQueries({ queryKey: profileKeys.all });
    queryClient.invalidateQueries({ queryKey: followKeys.all });
    queryClient.invalidateQueries({ queryKey: conversationKeys.conversations() });
};