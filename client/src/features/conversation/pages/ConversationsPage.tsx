import TopBar from "@/app/TopBar";
import ConversationCard from "../components/ConversationCard";
import { useFetchConversations } from "../hooks/useFetchConversations";
import { SentinelLoadingItem } from "@/components";
import { useEffect, useRef } from "react";

const ConversationsPage = () => {

    const observerTarget = useRef<HTMLDivElement | null>(null);

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending: isFetchConversationsPending, isError: isFetchConversationsError } = useFetchConversations();
    const conversations = data ?? [];

    useEffect(() => {

        const observer = new IntersectionObserver((entries) => {

            if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            };

        }, { threshold: 0.1 });

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        };

        return () => {

            if (currentTarget) {

                observer.unobserve(currentTarget);
            };
        };
    }, [hasNextPage, isFetchingNextPage]);

    return (
        <>
            <TopBar>
                Conversation
            </TopBar>

            <section>
                {
                    !isFetchConversationsPending && !isFetchConversationsError && conversations.length === 0 && (
                        <p className="pt-50 text-center text-sm text-secondary-500">
                            No conversations yet.
                        </p>
                    )
                }

                {
                    conversations.map((conversation) => (
                        <ConversationCard key={conversation._id} conversation={conversation} />
                    ))
                }

                {
                    !isFetchConversationsPending && <SentinelLoadingItem
                        ref={observerTarget}
                        hasNextPage={hasNextPage}
                        hasItems={conversations.length > 0}
                        isFetchingNextPage={isFetchingNextPage}
                    />
                }
            </section>
        </>
    )
}

export default ConversationsPage;