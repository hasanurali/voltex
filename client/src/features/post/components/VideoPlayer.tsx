import React, { useEffect, useRef, useState } from "react";
import { Fullscreen, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { transformVideoUrl, transformVideoUrlToPoster } from "@/lib";
import { Spinner } from "@/components";


let activeVideo: HTMLVideoElement | null = null;

const playVideo = async (video: HTMLVideoElement) => {

    if (activeVideo && activeVideo !== video) {
        activeVideo.pause();
    };

    activeVideo = video;

    try {
        await video.play();
    } catch {
        if (activeVideo === video) {
            activeVideo = null;
        };
    };
};

interface VideoPlayerProps {
    url: string;
    isPostCenter?: boolean;
};


const VideoPlayer = ({ url, isPostCenter }: VideoPlayerProps) => {

    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isInteract, setIsInteract] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const controlsTimerRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        return () => {
            if (controlsTimerRef.current) {
                window.clearTimeout(controlsTimerRef.current);
            };

            const video = videoRef.current;
            if (video && activeVideo === video) {
                video.pause();
                activeVideo = null;
            };
        };
    }, []);

    const togglePlay = async () => {

        const video = videoRef.current;
        if (!video) {
            return;
        };

        if (video.paused) {
            await playVideo(video);
            setIsPlaying(!video.paused);
        }
        else {
            video.pause();
            if (activeVideo === video) {
                activeVideo = null;
            };
            setIsPlaying(false);
        };
    };

    const toggleMute = () => {

        const video = videoRef.current;
        if (!video) {
            return;
        };

        video.muted = !video.muted;
        setIsMuted(video.muted);
    };

    const handleFullscreen = async () => {

        const container = containerRef.current;
        if (!container) {
            return;
        };

        if (document.fullscreenElement) {
            await document.exitFullscreen();
            return;
        };

        await container.requestFullscreen();
    };

    const handleTimeUpdate = () => {

        const video = videoRef.current;
        if (!video) {
            return;
        };

        const current = video.currentTime;
        const total = video.duration || 1;

        setCurrentTime(current);
        setProgress((current / total) * 100);
    };

    const handleLoadedMetadata = () => {

        const video = videoRef.current;
        if (video) {
            setDuration(video.duration || 0);
        };
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {

        const video = videoRef.current;
        if (!video) {
            return;
        };

        const rect = e.currentTarget.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const nextTime = percent * (video.duration || 0);

        video.currentTime = nextTime;
        setCurrentTime(nextTime);
        setProgress((nextTime / (video.duration || 1)) * 100);
    };

    const handleMouseMove = () => {

        setShowControls(true);

        if (controlsTimerRef.current) {
            window.clearTimeout(controlsTimerRef.current);
        };

        controlsTimerRef.current = window.setTimeout(() => {
            if (isPlaying) {
                setShowControls(false);
            };
        }, 2500);
    };

    const formatTime = (seconds: number) => {

        if (!Number.isFinite(seconds) || seconds <= 0) {
            return "0:00";
        };

        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${String(secs).padStart(2, "0")}`;
    };

    useEffect(() => {

        const video = videoRef.current;
        if (!video) {
            return;
        };

        if (isPostCenter) {
            void playVideo(video)
                .then(() => setIsPlaying(!video.paused));
        }
        else {
            video.pause();
            if (activeVideo === video) {
                activeVideo = null;
            };
            setIsPlaying(false);
        };
    }, [isPostCenter]);

    useEffect(() => {

        const container = containerRef.current;
        if (!container) {
            return;
        };

        const handleKeyDown = (e: KeyboardEvent) => {

            if (document.fullscreenElement && e.code === "Space") {
                e.preventDefault();

                if (document.activeElement instanceof HTMLButtonElement) {
                    document.activeElement.blur();
                };

                togglePlay();
            };
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative h-full w-full cursor-pointer overflow-hidden rounded-md border border-white/10 bg-black"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
            onClick={(e) => {
                e.stopPropagation();
                togglePlay();
            }}
        >

            {/* Mute controll overlay */}
            {
                !isInteract && <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(false);
                        setIsInteract(true);
                    }}
                    className="absolute inset-0 z-10"
                >
                </div>
            }

            {/* Video element */}
            <video
                ref={videoRef}
                src={transformVideoUrl(url)}
                poster={transformVideoUrlToPoster(url)}
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onLoadStart={() => setIsLoading(true)}
                onWaiting={() => setIsLoading(true)}
                onCanPlayThrough={() => setIsLoading(false)}
                onPlaying={() => setIsLoading(false)}
                onPause={() => setIsPlaying(false)}
                playsInline
                preload="metadata"
                className="block h-full w-full aspect-video object-contain"
            />

            {/* Center play button */}
            {
                isLoading ?
                    <div className="absolute inset-0 pb-10 flex items-center justify-center">
                        <Spinner size="lg" className="border-t-white! border-white/20!" />
                    </div>
                    :
                    !isPlaying && (
                        <div className="absolute inset-0 pb-10 flex items-center justify-center bg-black/15">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlay();
                                }}
                                type="button"
                                className="group flex h-14 w-14 items-center justify-center rounded-full bg-black/45 shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition duration-200 hover:scale-105 active:scale-95 focus:outline-none sm:h-18 sm:w-18 md:h-20 md:w-20 cursor-pointer"
                            >
                                <Play className="ml-1 h-7 w-7 fill-current text-white sm:h-8 sm:w-8 md:h-9 md:w-9" />
                            </button>
                        </div>
                    )
            }

            {/* Video controls */}
            <div onClick={(e) => e.stopPropagation()} className={`absolute inset-x-0 bottom-0 bg-linear-to-t from-black via-black/80 to-transparent px-3 pb-2.5 pt-8 transition-opacity duration-300 sm:px-4 sm:pb-3 ${showControls ? "opacity-100" : "opacity-0"}`}>

                {/* Seek bar */}
                <div onClick={handleSeek} className="mb-3 h-1.5 cursor-pointer rounded-full bg-white/30 sm:mb-4">
                    <div style={{ width: `${progress}%` }} className="relative h-full rounded-full bg-white">
                        <span className="pointer-events-none absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white/80 bg-white shadow-[0_1px_5px_rgba(0,0,0,0.45)]" />
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                togglePlay();
                            }}
                            type="button"
                            aria-label={isPlaying ? "Pause video" : "Play video"}
                            className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/10 sm:h-8 sm:w-8 cursor-pointer"
                        >
                            {
                                isPlaying ?
                                    <Pause className="h-4 w-4 sm:h-5 sm:w-5" />
                                    :
                                    <Play className="h-4 w-4 sm:h-5 sm:w-5" />
                            }
                        </button>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleMute();
                            }}
                            type="button"
                            className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/10 sm:h-8 sm:w-8 cursor-pointer"
                        >
                            {
                                isMuted ?
                                    <VolumeX className="h-4 w-4 sm:h-5 sm:w-5" />
                                    :
                                    <Volume2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            }
                        </button>

                        <span className="ml-0.5 text-[10px] text-white/80 sm:text-[12px]">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFullscreen();
                        }}
                        type="button"
                        className="flex h-7 w-7 items-center justify-center rounded-full text-white transition hover:bg-white/10 sm:h-8 sm:w-8 cursor-pointer"
                    >
                        <Fullscreen className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;