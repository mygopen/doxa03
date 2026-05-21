import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Clock,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { SubtitleItem } from "../types";
import {
  HAS_PUBLIC_VIDEO_URL,
  R2_DASHBOARD_OBJECT_URL,
  R2_OBJECT_PATH,
  VIDEO_SOURCE_URL,
  VIDEO_SOURCE_KIND,
} from "../videoConfig";

const TIMELINE_MARKERS = [0, 16, 24, 31, 42, 52, 65, 79, 89];

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
  const [duration, setDuration] = useState<number>(98);
  const [videoError, setVideoError] = useState(false);

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

  const currentSceneLabel = currentSubtitle
    ? `${currentSubtitle.sceneTitle} · ${currentSubtitle.speaker}`
    : "等待播放";

  const publicUrlHint = HAS_PUBLIC_VIDEO_URL
    ? VIDEO_SOURCE_KIND
    : "R2 PUBLIC URL NEEDED";

  return (
    <div className="space-y-4">
      {/* 1. Main player panel screen area */}
      <div className="relative aspect-video w-full rounded-2xl bg-neutral-950 border border-[#E6E4DD] shadow-md overflow-hidden">
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

        <div className="pointer-events-none absolute left-3 right-3 top-3 flex items-start justify-between gap-3">
          <span className="rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/90 backdrop-blur">
            {publicUrlHint}
          </span>
          <span className="max-w-[64%] truncate rounded-md bg-black/70 px-2.5 py-1 text-[10px] font-mono text-white/80 backdrop-blur">
            {R2_OBJECT_PATH}
          </span>
        </div>

        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/90 p-6 text-center">
            <div className="max-w-lg space-y-3 rounded-xl border border-amber-300/40 bg-neutral-900 p-5 text-white shadow-xl">
              <AlertTriangle className="mx-auto h-8 w-8 text-amber-300" />
              <div className="space-y-1">
                <h3 className="text-base font-bold">影片尚無法公開載入</h3>
                <p className="text-sm leading-relaxed text-neutral-300">
                  目前物件是 {R2_OBJECT_PATH}。Cloudflare Dashboard 連結只供管理使用，請使用 R2 的 Public Development URL、Custom Domain URL，或可讀取的 MP4 URL。
                </p>
              </div>
              <a
                href={R2_DASHBOARD_OBJECT_URL}
                className="pointer-events-auto inline-flex rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-neutral-900 transition hover:bg-amber-100"
                target="_blank"
                rel="noreferrer"
              >
                開啟 R2 物件頁
              </a>
            </div>
          </div>
        )}

        {currentSubtitle && !videoError && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-4 pt-16 md:px-8 md:pb-7">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-2 text-[10px] font-mono font-bold uppercase tracking-widest text-white/55">
                {currentSceneLabel}
              </p>
              <p className="text-base font-bold leading-relaxed text-white drop-shadow md:text-xl">
                {currentSubtitle.text}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 2. Media control deck */}
      <div className="bg-white border border-[#E6E4DD] rounded-xl p-4 shadow-xs space-y-4">
        {/* Timeline Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 font-mono">
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
              className="w-full h-2 rounded-lg bg-gray-100 appearance-none cursor-pointer accent-[#8C2D19] focus:outline-none focus:ring-1 focus:ring-[#8C2D19]"
            />
            {/* Markers on timeline slider representing major scenes */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none px-1">
              {TIMELINE_MARKERS.map((m) => (
                <div 
                  key={m} 
                  className={`w-1.5 h-1.5 rounded-full ${currentTime >= m ? 'bg-[#8C2D19]' : 'bg-gray-300'}`} 
                  style={{ left: `${(m / duration) * 100}%` }}
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
              className="p-2 text-gray-500 hover:text-[#8C2D19] hover:bg-[#FAF9F5] rounded-lg transition-colors duration-150 disabled:opacity-50"
              title="上一句字幕"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            {/* Play/Pause Main Btn */}
            <button
              onClick={handleTogglePlayback}
              disabled={videoError}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide shadow-xs transition-all duration-200 ${
                isPlaying 
                  ? "bg-[#1A1A1A] text-white hover:bg-neutral-800" 
                  : "bg-[#8C2D19] text-white hover:bg-[#732414] hover:-translate-y-0.5"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" /> 暫停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> 播放
                </>
              )}
            </button>

            {/* Next Track Btn */}
            <button
              onClick={onNextSubtitle}
              disabled={!currentSubtitle}
              className="p-2 text-gray-500 hover:text-[#8C2D19] hover:bg-[#FAF9F5] rounded-lg transition-colors duration-150 disabled:opacity-50"
              title="下一句字幕"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            {/* Reset Btn */}
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentTime(0);
                if (videoRef.current) videoRef.current.currentTime = 0;
              }}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              title="重置播放進度至 00:00"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-gray-400 font-mono font-semibold mr-1 flex items-center gap-0.5">
              <Clock className="w-3.5 h-3.5" /> 播放倍速:
            </span>
            {[1, 1.5, 2].map((s) => (
              <button
                key={s}
                onClick={() => setPlaySpeed(s)}
                className={`px-3 py-1.5 font-semibold font-mono rounded-md border tracking-tight transition-all ${
                  playSpeed === s 
                    ? "bg-[#FAF9F5] border-[#8C2D19] text-[#8C2D19]" 
                    : "bg-white border-[#E6E4DD] text-gray-500 hover:bg-gray-50"
                }`}
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
