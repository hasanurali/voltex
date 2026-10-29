import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "@/app/TopBar";
import { useAuthStore } from "@/store";
import { ImageWithSkeleton } from "@/components/media";
import { useFetchConversationDetails } from "../hooks/useFetchConversationDetails";
import { SentinelLoadingItem, Spinner } from "@/components";
import { CreateMessageInput, MessageCard, TemporaryMessageCard, useFetchConversationMessages } from "@/features/message";
import type { Message, TemporaryMessage } from "@/features/message/type";
import { messageKeys } from "@/features/message/api/messageKeys";
import { useQueryClient } from "@tanstack/react-query";
import { useMarkAllConversationMessagesAsRead } from "../hooks/useMarkAllConversationMessagesAsRead";

const ConversationDetailsPage = () => {

    const [temporaryMessages, setTemporaryMessages] = useState(new Map<string, TemporaryMessage>());

    const { conversationId } = useParams<{ conversationId: string }>();

    const navigate = useNavigate();

    const observerTarget = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const messageListLastItemRef = useRef<HTMLDivElement>(null);
    const firstMessageRef = useRef<HTMLDivElement>(null);
    const previousCursorLength = useRef(0);
    const isCompleteInitialRender = useRef(false);

    const auth = useAuthStore((state) => state.auth);

    const { data: conversationDetails, isError } = useFetchConversationDetails(conversationId ?? '');

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isPending: isFetchMessagePending, isError: isFetchMessageError } = useFetchConversationMessages(conversationId ?? '');
    const messages = data?.data ?? [];

    const { mutate: markAllConversationMessagesAsReadMutate } = useMarkAllConversationMessagesAsRead();

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

    useEffect(() => {

        const container = containerRef.current;
        const firstMessage = firstMessageRef.current;
        const lastItem = messageListLastItemRef.current;
        const currentCursorLength = data?.cursorLength ?? 0;

        if (previousCursorLength.current > 0 && currentCursorLength !== previousCursorLength.current && container && firstMessage && isCompleteInitialRender.current) {

            previousCursorLength.current = currentCursorLength;

            const containerRect = container.getBoundingClientRect();
            const firstMessageRect = firstMessage.getBoundingClientRect();
            const targetScrollTop = (firstMessageRect.top - containerRect.top) + container.scrollTop;

            container.scrollTo({
                top: targetScrollTop,
                behavior: 'auto'
            });

            return;
        };

        if (lastItem && isCompleteInitialRender.current) {
            lastItem.scrollIntoView({
                behavior: 'smooth'
            });

            return;
        };

        if (container && messages.length > 0) {
            isCompleteInitialRender.current = true;
            previousCursorLength.current = currentCursorLength;

            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'auto'
            });
        };
    }, [messages, temporaryMessages, data?.cursorLength]);

    const queryClient = useQueryClient();

    useEffect(() => {
        return () => {
            queryClient.invalidateQueries({ queryKey: messageKeys.conversationMessages(conversationDetails?._id ?? '') })
        }
    }, []);

    useEffect(() => {
        if (conversationDetails?._id) {
            markAllConversationMessagesAsReadMutate(conversationDetails._id);
        };
    }, []);

    if (!conversationDetails || isError) {
        return (
            <>
                <TopBar>Conversation</TopBar>

                <div className="flex min-h-[60vh] items-center justify-center">
                    <Spinner size="lg" />
                </div>
            </>
        );
    };

    const { _id, participants } = conversationDetails;
    const messagedUser = participants.filter(participant => participant._id !== auth?.user._id)[0];

    const navigateToProfile = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/profile/${messagedUser.username}`);
    };

    return (
        <>
            <TopBar>
                <span className="flex gap-3">
                    <button
                        type="button"
                        onClick={navigateToProfile}
                        className="cursor-pointer"
                    >
                        <ImageWithSkeleton
                            src={messagedUser.avatar}
                            alt={messagedUser.displayName}
                            className="h-full w-full rounded-full object-cover"
                            containerClassName="h-12 w-12 shrink-0 rounded-full bg-secondary-100"
                        />
                    </button>
                    <span className="flex flex-col">
                        <span onClick={navigateToProfile} className="text-[18px] font-medium cursor-pointer">{messagedUser.displayName}</span>
                        <span className="text-sm text-secondary-500">online</span>
                    </span>
                </span>
            </TopBar>

            <section className="flex flex-col justify-between gap-1 min-h-0 h-[calc(100vh-109.6px)] md:h-[calc(100vh-64.8px)] px-2 md:px-5 pb-2 md:pb-5 overflow-hidden">
                <div ref={containerRef} className="flex flex-col gap-3 h-full overflow-y-scroll pt-2">
                    {
                        !isFetchMessagePending && !isFetchMessageError && messages.length === 0 && (
                            <p className="pt-50 text-center text-sm text-secondary-500">
                                No messages yet.
                            </p>
                        )
                    }
                    {
                        !isFetchMessagePending && (
                            <SentinelLoadingItem
                                ref={observerTarget}
                                hasNextPage={hasNextPage}
                                hasItems={messages.length > 0}
                                isFetchingNextPage={isFetchingNextPage}
                            />
                        )
                    }
                    {
                        messages?.map((message, i) => <MessageCard
                            key={message._id}
                            message={message}
                            isOwnMessage={message.sender._id !== messagedUser._id}
                            ref={i === messages.length - 10 ? firstMessageRef : undefined}
                        />
                        )
                    }
                    {
                        [...temporaryMessages.values()].map(message => {

                            if (message.isTemporary) {
                                return <TemporaryMessageCard
                                    key={message._id}
                                    temporaryMessage={message}
                                    isOwnMessage={true}
                                />
                            };

                            return <MessageCard
                                key={message._id}
                                message={message as Message}
                                isOwnMessage={true}
                                deleteMessage={(messageId: string) => setTemporaryMessages(tm => {

                                    const newMap = new Map(tm);

                                    for (const [key, message] of newMap.entries()) {
                                        if (message._id === messageId) {
                                            newMap.delete(key);
                                            break;
                                        };
                                    }

                                    return newMap;
                                })}
                            />
                        })
                    }
                    <div ref={messageListLastItemRef} />
                </div>

                <CreateMessageInput
                    createId={_id}
                    createIdType="conversation"
                    setMessage={(key: string, val: TemporaryMessage) => setTemporaryMessages(tm => {

                        const newMap = new Map(tm);
                        newMap.set(key, val);

                        return newMap;
                    })}
                    setProgress={(key: string, cb: (progress: number[]) => number[]) => setTemporaryMessages(tm => {

                        const target = tm.get(key);
                        if (!target) {
                            return tm;
                        };

                        const newMap = new Map(tm);
                        const updatedMessage = { ...target };

                        updatedMessage.progress = cb([...updatedMessage.progress as number[]]);
                        newMap.set(key, updatedMessage);

                        return newMap;
                    })}
                />
            </section>
        </>
    )
}

export default ConversationDetailsPage;