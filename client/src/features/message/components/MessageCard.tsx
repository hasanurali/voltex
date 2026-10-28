import React, { useState } from "react";
import { createPortal } from "react-dom";
import { CheckCheck, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ImageWithSkeleton } from "@/components/media";
import type { Message } from "../type";
import { timeConverter } from "@/utils";

interface MessageCardProps {
    message: Message;
    isOwnMessage: boolean;
    ref?: React.Ref<HTMLDivElement>;
};

const MessageCard = ({ message, isOwnMessage, ref }: MessageCardProps) => {

    const [currentMediaIndex, setCurrentMediaIndex] = useState<number | null>(null);

    const { content, media = [], createdAt, isSeen } = message;

    const previewMedia = media[0];
    const additionalMediaCount = media.length - 1;

    const messageMedia = media[0]?.mediaType === 'image' ? media : [];
    const currentViewerMedia = currentMediaIndex !== null ? messageMedia[currentMediaIndex] : null;

    return (
        <div ref={ref} className={`flex w-full max-w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex min-w-0 max-w-[min(430px,calc(100%-44px))] flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                <div className={`min-w-24 rounded-2xl px-1.5 pt-1.5 pb-1 shadow-sm ${isOwnMessage ? 'rounded-br-sm border border-blue-200 bg-blue-100' : 'rounded-bl-sm border border-neutral-200 bg-neutral-100'}`}>

                    {/* Media Attachments */}
                    {
                        previewMedia && (
                            <div onClick={() => setCurrentMediaIndex(0)} className="relative aspect-square w-60 max-w-full overflow-hidden rounded-xl bg-neutral-200 cursor-zoom-in">
                                {
                                    previewMedia.mediaType === 'image' ? (
                                        <ImageWithSkeleton
                                            src={previewMedia.url}
                                            alt="Message attachment"
                                            className="h-full w-full object-cover"
                                            containerClassName="h-full w-full"
                                        />
                                    ) : (
                                        <video
                                            src={previewMedia.url}
                                            aria-label="Message video attachment"
                                            controls
                                            className="h-full w-full object-cover"
                                        />
                                    )
                                }
                                {
                                    previewMedia.mediaType === 'image' && additionalMediaCount > 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-2xl font-semibold text-white">
                                            +{additionalMediaCount}
                                        </div>
                                    )
                                }

                            </div>
                        )
                    }

                    {/* Content, Time and seened info */}
                    <div className={`flex items-end gap-3 ${previewMedia ? 'px-2 pt-2 pb-1' : 'px-2 pt-1.5 pb-1'}`}>
                        <p className={`min-w-0 flex-1 wrap-break-word text-sm leading-5 ${isOwnMessage ? 'text-blue-950' : 'text-secondary-900'}`}>
                            {content}
                        </p>
                        <time
                            dateTime={createdAt}
                            className="ml-auto flex shrink-0 items-center gap-1 self-end whitespace-nowrap text-[11px] leading-4 text-secondary-500"
                        >
                            {timeConverter(createdAt)}
                            {isOwnMessage && (
                                <>
                                    {isSeen
                                        ? <CheckCheck aria-label="Seen" className="h-4 w-4 text-sky-500 " />
                                        : <CheckCheck aria-label="Sent" className="h-3.5 w-3.5" />}
                                </>
                            )}
                        </time>
                    </div>
                </div>
            </div>

            {/* Full-screen image section */}
            {
                (messageMedia.length >= 1 && currentMediaIndex !== null) && createPortal(<>
                    {
                        currentMediaIndex !== null && messageMedia[currentMediaIndex] && (
                            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4" role="dialog" aria-label="Post media viewer" onClick={() => setCurrentMediaIndex(null)}>
                                <button type="button" onClick={() => setCurrentMediaIndex(null)} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white cursor-pointer">
                                    <X className="h-5 w-5" />
                                </button>

                                {
                                    currentViewerMedia?.mediaType === "image" && messageMedia.length > 1 && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const previousPosition = (currentMediaIndex - 1 + messageMedia.length) % messageMedia.length;
                                                setCurrentMediaIndex(previousPosition);
                                            }}
                                            type="button"
                                            aria-label="Previous image"
                                            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:left-6 sm:h-12 sm:w-12"
                                        >
                                            <ChevronLeft className="h-6 w-6" />
                                        </button>
                                    )
                                }

                                <div className="flex h-[min(72vh,760px)] w-[min(92vw,1100px)] items-center justify-center" onClick={(event) => event.stopPropagation()}>
                                    {
                                        currentViewerMedia && <img src={currentViewerMedia.url} alt={`Post image ${currentMediaIndex + 1}`} className="max-h-full max-w-full object-contain" />
                                    }
                                </div>

                                {
                                    currentViewerMedia?.mediaType === "image" && messageMedia.length > 1 && (
                                        <button type="button" onClick={(e) => {
                                            e.stopPropagation();
                                            const nextPosition = (currentMediaIndex + 1) % messageMedia.length;
                                            setCurrentMediaIndex(nextPosition);
                                        }}
                                            aria-label="Next image"
                                            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:h-12 sm:w-12">
                                            <ChevronRight className="h-6 w-6" />
                                        </button>
                                    )
                                }

                                {
                                    currentViewerMedia?.mediaType === "image" && (
                                        <>
                                            {
                                                messageMedia.length > 1 && (
                                                    <div className="mt-4 flex max-w-full items-center gap-2 overflow-x-auto px-2" onClick={(event) => event.stopPropagation()}>
                                                        {
                                                            messageMedia.map(({ url }, i) => (
                                                                <button
                                                                    key={`${url}-${i}`}
                                                                    onClick={() => setCurrentMediaIndex(i)}
                                                                    className={`relative h-12 w-12 shrink-0 overflow-hidden rounded border-2 bg-neutral-800 sm:h-14 sm:w-14 ${currentMediaIndex === i ? "border-white" : "border-transparent opacity-60 hover:opacity-100"}`}
                                                                >
                                                                    <img src={url} alt="" className="h-full w-full object-cover" />
                                                                </button>
                                                            ))
                                                        }
                                                    </div>
                                                )
                                            }
                                            <p className="mt-2 text-xs text-white/70">{currentMediaIndex + 1} / {messageMedia.length}</p>
                                        </>
                                    )
                                }
                            </div>
                        )
                    }
                </>,
                    document.body
                )
            }
        </div>
    )
};

export default MessageCard;