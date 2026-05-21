import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Clock,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { SubtitleItem } from "../types";
import {
  R2_DASHBOARD_OBJECT_URL,
  R2_OBJECT_PATH,
  VIDEO_SOURCE_URL,
} from "../videoConfig";

const TIMELINE_MARKERS = [0, 16, 24, 30, 42, 52, 63, 79, 89];

interface StoryboardViewProps {
  currentTime: number;
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  playSpeed: number;
  setPlaySpeed: React.Dispatch<React.SetStateAction<number>>;
  currentSubtitle: SubtitleItem | null;
  onPrevSubtitle: () => void;
  onNextSubtitle: () => void;
}

export default function StoryboardView({
  currentTime,
  setCurrentTime,
  isPlaying,
  setIsPlaying,
  playSpeed,
  setPlaySpeed,
  currentSubtitle,
  onPrevSubtitle,
  onNextSubtitle
}: StoryboardViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);
  const [duration, setDuration] = useState<number>(98);
  const [videoError, setVideoError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Math.abs(video.currentTime - currentTime) > 0.5) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = playSpeed;
  }, [playSpeed]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || videoError) return;

    if (isPlaying) {
      video.play().catch(() => {
        setIsPlaying(false);
        setVideoError(true);
      });
    } else {
      video.pause();
    }
  }, [isPlaying, setIsPlaying, videoError]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === playerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  // Format seconds to text e.g., 01:24
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video || Number.isNaN(video.duration)) return;
    setDuration(video.duration);
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(Number(video.currentTime.toFixed(1)));
  };

  const handleTogglePlayback = () => {
    if (!VIDEO_SOURCE_URL || videoError) return;
    setIsPlaying((playing) => !playing);
  };

  const handleToggleFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await playerRef.current?.requestFullscreen();
  };

  const subtitleTextSize = currentSubtitle && currentSubtitle.text.length > 90
    ? "text-base md:text-xl"
    : currentSubtitle && currentSubtitle.text.length > 58
      ? "text-lg md:text-2xl"
      : "text-xl md:text-3xl";

  return (
    <div className="space-y-4">
      {/* 1. Main player panel screen area */}
      <div
        ref={playerRef}
        className="doxa03-player-shell sketch-player-shell relative aspect-video w-full overflow-hidden"
      >
        <video
          ref={videoRef}
          className="h-full w-full bg-black object-contain"
          src={VIDEO_SOURCE_URL}
          preload="metadata"
          playsInline
          onClick={handleTogglePlayback}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onCanPlay={() => setVideoError(false)}
          onError={() => {
            setIsPlaying(false);
            setVideoError(true);
          }}
        >
          <source src={VIDEO_SOURCE_URL} type="video/mp4" />
        </video>

        <div className="pointer-events-none absolute right-3 top-3 flex justify-end">
          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="pointer-events-auto inline-flex h-11 w-11 rotate-1 items-center justify-center border-[3px] border-[var(--pencil)] bg-white text-[var(--pencil)] shadow-[4px_4px_0_0_var(--pencil)] transition-transform duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[var(--post-it)] hover:shadow-[2px_2px_0_0_var(--pencil)] focus:outline-none focus:ring-2 focus:ring-[var(--ballpoint)]/30"
            style={{ borderRadius: "18px 10px 20px 12px / 12px 20px 11px 18px" }}
            title={isFullscreen ? "離開全螢幕" : "全螢幕播放"}
            aria-label={isFullscreen ? "離開全螢幕" : "全螢幕播放"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-5 w-5" strokeWidth={3} />
            ) : (
              <Maximize2 className="h-5 w-5" strokeWidth={3} />
            )}
          </button>
        </div>

        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/90 p-6 text-center">
            <div className="sketch-postit max-w-lg space-y-3 p-5 text-[var(--pencil)]">
              <AlertTriangle className="mx-auto h-8 w-8 text-[var(--marker-red)]" strokeWidth={3} />
              <div className="space-y-1">
                <h3 className="font-sketch-heading text-2xl">影片尚無法公開載入</h3>
                <p className="text-lg leading-relaxed">
                  目前物件是 {R2_OBJECT_PATH}。Cloudflare Dashboard 連結只供管理使用，請使用 R2 的 Public Development URL、Custom Domain URL，或可讀取的 MP4 URL。
                </p>
              </div>
              <a
                href={R2_DASHBOARD_OBJECT_URL}
                className="sketch-button pointer-events-auto text-lg"
                target="_blank"
                rel="noreferrer"
              >
                開啟 R2 物件頁
              </a>
            </div>
          </div>
        )}

        {currentSubtitle && !videoError && (
          <div className="sketch-subtitle pointer-events-none absolute bottom-0 left-0 right-0 px-4 pb-4 pt-16 md:px-8 md:pb-7">
            <div className="mx-auto max-w-4xl text-center">
              <p className={`${subtitleTextSize} font-bold leading-relaxed text-white drop-shadow`}>
                {currentSubtitle.text}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Media control deck */}
      <div className="sketch-card relative space-y-5 p-5">
        <span className="sketch-tape" />
        {/* Timeline Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-lg font-bold text-[var(--pencil)]/75">
            <span>當前秒數: {formatTime(currentTime)}</span>
            <span>總長: {formatTime(duration)}</span>
          </div>
          <div className="relative group/slider">
            <input
              type="range"
              min="0"
              max={duration}
              step="1"
              value={currentTime}
              onChange={(e) => {
                setCurrentTime(Number(e.target.value));
              }}
              className="sketch-range h-6 w-full cursor-pointer appearance-none bg-transparent focus:outline-none"
            />
            {/* Markers on timeline slider representing major scenes */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none px-1">
              {TIMELINE_MARKERS.map((m) => (
                <div 
                  key={m} 
                  className={`h-3 w-3 border-2 border-[var(--pencil)] ${currentTime >= m ? 'bg-[var(--marker-red)]' : 'bg-white'}`} 
                  style={{ borderRadius: "50% 42% 55% 45% / 48% 54% 44% 52%" }}
                  title={`節點: ${formatTime(m)}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center Control Deck */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Prev Track Btn */}
            <button
              onClick={onPrevSubtitle}
              disabled={!currentSubtitle}
              className="sketch-icon-button"
              title="上一句字幕"
            >
              <SkipBack className="h-5 w-5" strokeWidth={3} />
            </button>

            {/* Play/Pause Main Btn */}
            <button
              onClick={handleTogglePlayback}
              disabled={videoError}
              className={`sketch-button text-xl ${
                isPlaying 
                  ? "bg-[var(--pencil)] text-white" 
                  : "bg-[var(--marker-red)] text-white"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-5 w-5 fill-white" strokeWidth={3} /> 暫停
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-white" strokeWidth={3} /> 播放
                </>
              )}
            </button>

            {/* Next Track Btn */}
            <button
              onClick={onNextSubtitle}
              disabled={!currentSubtitle}
              className="sketch-icon-button"
              title="下一句字幕"
            >
              <SkipForward className="h-5 w-5" strokeWidth={3} />
            </button>

            {/* Reset Btn */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentTime(0);
                if (videoRef.current) videoRef.current.currentTime = 0;
              }}
              className="sketch-icon-button"
              title="重置播放進度至 00:00"
            >
              <RotateCcw className="h-5 w-5" strokeWidth={3} />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2 text-lg">
            <span className="mr-1 flex items-center gap-1 font-bold text-[var(--pencil)]/70">
              <Clock className="h-4 w-4" strokeWidth={3} /> 播放倍速:
            </span>
            {[1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => setPlaySpeed(s)}
                className={`border-2 border-[var(--pencil)] px-3 py-1 font-bold shadow-[2px_2px_0_0_var(--pencil)] transition-transform duration-100 hover:rotate-1 ${
                  playSpeed === s 
                    ? "bg-[var(--post-it)] text-[var(--marker-red)]" 
                    : "bg-white text-[var(--pencil)]"
                }`}
                style={{ borderRadius: "18px 10px 16px 12px / 12px 16px 10px 18px" }}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
