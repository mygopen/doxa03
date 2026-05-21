import { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, RotateCcw, SkipForward, SkipBack, 
  Clock, Volume2, ShieldCheck, HelpCircle, AlertOctagon, 
  Newspaper, Users, Eye, Sun, ChefHat, Glasses, Compass, Coffee,
  AlertCircle
} from "lucide-react";
import { SubtitleItem } from "../types";

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
  
  // Timer effect for simulating the video playback progress
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1 * playSpeed;
          if (nextTime >= 138) { // Maximum length of our video is 1分38秒 (98-138 seconds max, let's set max to 138)
            setIsPlaying(false);
            return 138;
          }
          return Number(nextTime.toFixed(1));
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playSpeed, setCurrentTime, setIsPlaying]);

  // Format seconds to text e.g., 01:24
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper to render customized storyboard icons with nice animation
  const renderVisualCard = () => {
    if (!currentSubtitle) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-lg">
          <HelpCircle className="w-12 h-12 mb-2 stroke-1" />
          <p className="font-mono text-sm">無正在播映的場景資料。請點擊播放或重置進度。</p>
        </div>
      );
    }

    const { id, sceneTitle, visualClue, speaker } = currentSubtitle;

    // Distinguish background styles and big icons based on theme ID
    let cardBg = "bg-slate-50 border-slate-200 text-slate-800";
    let iconColor = "text-slate-600";
    let iconElement = <ShieldCheck className="w-16 h-16" />;

    if (id === "sub-1" || id === "sub-2" || id === "sub-3") {
      cardBg = "bg-gradient-to-tr from-slate-100 to-indigo-50 border-indigo-100 text-indigo-900";
      iconColor = "text-indigo-600";
      iconElement = <ShieldCheck className="w-14 h-14" />;
    } else if (id === "sub-4") {
      cardBg = "bg-gradient-to-tr from-stone-200 to-stone-50 border-stone-300 text-stone-900";
      iconColor = "text-red-700";
      iconElement = <Users className="w-14 h-14" />;
    } else if (id === "sub-5") {
      cardBg = "bg-gradient-to-tr from-yellow-50 to-amber-100 border-amber-200 text-amber-900";
      iconColor = "text-amber-600";
      iconElement = <Volume2 className="w-14 h-14 animate-pulse" />;
    } else if (id === "sub-6" || id === "sub-7") {
      cardBg = "bg-gradient-to-tr from-amber-50 to-red-50 border-red-100 text-red-950";
      iconColor = "text-[#8C2D19]";
      iconElement = <Newspaper className="w-14 h-14" />;
    } else if (id === "sub-8" || id === "sub-9" || id === "sub-10" || id === "sub-11" || id === "sub-12") {
      cardBg = "bg-gradient-to-tr from-rose-50 to-orange-50 border-red-200 text-red-950";
      iconColor = "text-red-600";
      iconElement = <AlertOctagon className="w-14 h-14" />;
    } else if (id === "sub-13") {
      cardBg = "bg-gradient-to-tr from-teal-50 to-emerald-50 border-teal-200 text-teal-950";
      iconColor = "text-teal-600";
      iconElement = <ChefHat className="w-14 h-14" />;
    } else if (id === "sub-14") {
      cardBg = "bg-gradient-to-tr from-emerald-50 to-lime-50 border-emerald-200 text-emerald-950";
      iconColor = "text-emerald-700";
      iconElement = <ChefHat className="w-14 h-14" />;
    } else if (id === "sub-15") {
      cardBg = "bg-gradient-to-tr from-amber-500/10 to-orange-50 border-amber-300 text-amber-950";
      iconColor = "text-amber-700";
      iconElement = <Sun className="w-14 h-14" />;
    } else if (id === "sub-16" || id === "sub-17") {
      cardBg = "bg-gradient-to-tr from-cyan-50 to-indigo-50 border-indigo-200 text-indigo-950";
      iconColor = "text-indigo-600";
      iconElement = <Compass className="w-14 h-14" />;
    } else if (id === "sub-18") {
      cardBg = "bg-gradient-to-tr from-violet-50 to-fuchsia-50 border-violet-200 text-violet-950";
      iconColor = "text-violet-600";
      iconElement = <Glasses className="w-14 h-14" />;
    } else if (id === "sub-19") {
      cardBg = "bg-gradient-to-tr from-red-50 to-stone-250 border-stone-400 text-stone-900";
      iconColor = "text-red-700";
      iconElement = <AlertCircle className="w-14 h-14" />;
    } else if (id === "sub-20") {
      cardBg = "bg-gradient-to-tr from-stone-900 to-stone-800 border-stone-700 text-stone-100";
      iconColor = "text-amber-400";
      iconElement = <Coffee className="w-14 h-14" />;
    }

    return (
      <div className={`h-full border rounded-xl overflow-hidden shadow-xs flex flex-col justify-between transition-all duration-300 ${cardBg}`}>
        {/* Storyboard Header Tag */}
        <div className="px-4 py-3 border-b border-inherit flex items-center justify-between text-xs font-semibold uppercase tracking-wider font-mono opacity-80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            場景分鏡模擬
          </div>
          <span>SLOT ID: {id}</span>
        </div>

        {/* Middle illustration box */}
        <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 flex-1 justify-center">
          <div className={`p-4 rounded-xl bg-white/80 shadow-xs flex-shrink-0 border border-inherit ${iconColor}`}>
            {iconElement}
          </div>
          <div className="text-center md:text-left space-y-2">
            <h3 className="font-bold text-lg md:text-xl tracking-tight leading-snug">
              {sceneTitle}
            </h3>
            <p className="text-xs text-opacity-80 leading-relaxed max-w-lg italic">
              <strong>畫面線索描繪：</strong>{visualClue}
            </p>
            <div className="inline-flex items-center gap-1 rounded bg-black/5 px-2 py-0.5 text-xs font-medium font-mono">
              發話主角: <span className="font-semibold">{speaker}</span>
            </div>
          </div>
        </div>

        {/* Real-time Subtitle Screen Overlay - Dark Cinema Style */}
        <div className="mx-4 mb-4 mt-auto rounded-xl bg-neutral-900/95 border border-neutral-800 p-4 md:p-6 text-center shadow-lg relative min-h-[100px] flex items-center justify-center">
          {/* Subtle decoration to look like a real player */}
          <span className="absolute top-2 left-3 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
            LIVE SYNC SUBTITLE
          </span>
          <p className="text-white text-base md:text-lg font-bold font-sans leading-relaxed tracking-wide">
            {currentSubtitle.text}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* 1. Main player panel screen area */}
      <div className="relative aspect-video w-full rounded-2xl bg-neutral-950 p-1 md:p-2 border border-[#E6E4DD] shadow-md overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-neutral-950 to-neutral-950">
        <div className="h-full w-full bg-transparent rounded-xl overflow-hidden relative">
          {renderVisualCard()}
        </div>
      </div>

      {/* 2. Media control deck */}
      <div className="bg-white border border-[#E6E4DD] rounded-xl p-4 shadow-xs space-y-4">
        {/* Timeline Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 font-mono">
            <span>當前秒數: {formatTime(currentTime)}</span>
            <span>總長: 02:18 (138秒)</span>
          </div>
          <div className="relative group/slider">
            <input
              type="range"
              min="0"
              max="138"
              step="1"
              value={currentTime}
              onChange={(e) => {
                setCurrentTime(Number(e.target.value));
              }}
              className="w-full h-2 rounded-lg bg-gray-100 appearance-none cursor-pointer accent-[#8C2D19] focus:outline-none focus:ring-1 focus:ring-[#8C2D19]"
            />
            {/* Markers on timeline slider representing major scenes */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none px-1">
              {[0, 16, 24, 31, 42, 52, 105, 119].map((m) => (
                <div 
                  key={m} 
                  className={`w-1.5 h-1.5 rounded-full ${currentTime >= m ? 'bg-[#8C2D19]' : 'bg-gray-300'}`} 
                  style={{ left: `${(m / 138) * 100}%` }}
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
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl font-semibold text-sm tracking-wide shadow-xs transition-all duration-200 ${
                isPlaying 
                  ? "bg-[#1A1A1A] text-white hover:bg-neutral-800" 
                  : "bg-[#8C2D19] text-white hover:bg-[#732414] hover:-translate-y-0.5"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" /> 模擬暫停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> 字幕播放
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
