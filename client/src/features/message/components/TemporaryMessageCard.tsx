import { useEffect, useState } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { ImageWithSkeleton } from "@/components/media";
import type { TemporaryMessage } from "../type";
import { timeConverter } from "@/utils";

interface MessageCardProps {
    temporaryMessage: TemporaryMessage;
    isOwnMessage: boolean;
};

const TemporaryMessageCard = ({ temporaryMessage, isOwnMessage }: MessageCardProps) => {

    const [hasFinishedProgress, setHasFinishedProgress] = useState(false);

    const { content, media = [], createdAt, progress } = temporaryMessage;

    const overallProgress = progress?.length ?
        progress.reduce((total, value) => total + Math.min(100, Math.max(0, value)), 0) / progress.length
        :
        0;
    const progressPercent = Math.floor(overallProgress);

    useEffect(() => {
        if (overallProgress < 100) {
            return;
        };

        const timeoutId = window.setTimeout(() => setHasFinishedProgress(true), 500);

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [overallProgress]);

    const previewMedia = media[0];
    const additionalMediaCount = media.length - 1;

    return (
        <div className={`flex w-full max-w-full ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex min-w-0 max-w-[min(430px,calc(100%-44px))] flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                <div className={`min-w-24 rounded-2xl px-1.5 pt-1.5 pb-1 shadow-sm ${isOwnMessage ? 'rounded-br-sm border border-blue-200 bg-blue-100' : 'rounded-bl-sm border border-neutral-200 bg-neutral-100'}`}>

                    {/* Media Attachments */}
                    {
                        previewMedia && (
                            <div className="relative aspect-square w-60 max-w-full overflow-hidden rounded-xl bg-neutral-200">
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
                                <div
                                    role="status"
                                    aria-label={hasFinishedProgress ? "Uploading message media" : `Uploading message media: ${progressPercent}%`}
                                    className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/30 text-white"
                                >
                                    <span className="relative flex h-12 w-12 items-center justify-center">
                                        <LoaderCircle aria-hidden="true" className="absolute inset-0 h-full w-full animate-spin" />
                                        {!hasFinishedProgress && (
                                            <span className="text-[10px] font-semibold leading-none drop-shadow">
                                                {progressPercent}%
                                            </span>
                                        )}
                                    </span>
                                </div>
                                {
                                    previewMedia.mediaType === 'image' && additionalMediaCount > 0 && (
                                        <div className="absolute right-2 top-2 z-20 rounded-md bg-black/50 px-2 py-1 text-sm font-semibold text-white">
                                            +{additionalMediaCount}
                                        </div>
                                    )
                                }

                            </div>
                        )
                    }

                    {/* Content, Time and seened info */}
                    <div className={`flex items-end gap-3 ${previewMedia ? 'px-2 pt-2 pb-1' : 'px-2 pt-1.5 pb-1'}`}>
                        <p className={`min-w-0 flex-1 wrap-anywhere whitespace-pre-wrap text-sm leading-5 ${isOwnMessage ? 'text-blue-950' : 'text-secondary-900'}`}>
                            {content}
                        </p>
                        <time
                            dateTime={createdAt}
                            className="ml-auto flex shrink-0 items-center gap-1 self-end whitespace-nowrap text-[11px] leading-4 text-secondary-500"
                        >
                            {timeConverter(createdAt)}
                            {isOwnMessage && <Check aria-label="Sent" className="h-3.5 w-3.5" />}
                        </time>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default TemporaryMessageCard;