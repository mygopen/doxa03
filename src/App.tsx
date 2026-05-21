import { useState, useEffect } from "react";
import Header from "./components/Header";
import StoryboardView from "./components/StoryboardView";
import TimelineTracks from "./components/TimelineTracks";
import FactCheckPanel from "./components/FactCheckPanel";
import { initialSubtitles } from "./data";
import { SubtitleItem } from "./types";
import { ShieldAlert } from "lucide-react";

export default function App() {
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>(initialSubtitles);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playSpeed, setPlaySpeed] = useState<number>(1);

  // Auto-find current subtitle segment based on simulated timeline (currentTime)
  const getCurrentSubtitle = (): SubtitleItem | null => {
    // 1. Find exact match
    const exactMatch = subtitles.find(
      (item) => currentTime >= item.startTime && currentTime <= item.endTime
    );
    if (exactMatch) return exactMatch;

    // 2. Fallback to the closest past subtitle to prevent flashings or empty screen
    const pastSubtitles = [...subtitles]
      .filter((item) => currentTime >= item.endTime)
      .sort((a, b) => b.endTime - a.endTime); // Sort descending to get the most recent past
    
    if (pastSubtitles.length > 0) {
      return pastSubtitles[0];
    }
    
    // 3. Last fallback
    return subtitles[0] || null;
  };

  const currentSubtitle = getCurrentSubtitle();

  // Jump player progress directly on timeline track click
  const handleSelectTime = (time: number) => {
    setCurrentTime(time);
  };

  // Inline subtitling interactive sync editor
  const handleUpdateSubtitleText = (id: string, text: string) => {
    setSubtitles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  // Reset to original well-crafted Media Literacy subsets
  const handleResetSubtitles = () => {
    setSubtitles(initialSubtitles);
  };

  // Controller buttons: skip to previous subtitle block
  const handlePrevSubtitle = () => {
    if (!currentSubtitle) return;
    const currentIndex = subtitles.findIndex((s) => s.id === currentSubtitle.id);
    if (currentIndex > 0) {
      setCurrentTime(subtitles[currentIndex - 1].startTime);
    }
  };

  // Controller buttons: skip to next subtitle block
  const handleNextSubtitle = () => {
    if (!currentSubtitle) return;
    const currentIndex = subtitles.findIndex((s) => s.id === currentSubtitle.id);
    if (currentIndex < subtitles.length - 1) {
      setCurrentTime(subtitles[currentIndex + 1].startTime);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#1A1A1A] font-sans antialiased flex flex-col selection:bg-red-100 selection:text-[#8C2D19]">
      {/* Universal introduction banner */}
      <Header />

      {/* Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        
        {/* Split grid for Player & Track Control vs Fact Check & Gemini Analyzer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT AREA: Simulated Anime Subtitle Player & Track editor (size 7/12) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Virtual Anime subtitle player */}
            <StoryboardView
              currentTime={currentTime}
              setCurrentTime={setCurrentTime}
              isPlaying={isPlaying}
              setIsPlaying={setIsPlaying}
              playSpeed={playSpeed}
              setPlaySpeed={setPlaySpeed}
              currentSubtitle={currentSubtitle}
              onPrevSubtitle={handlePrevSubtitle}
              onNextSubtitle={handleNextSubtitle}
            />

            {/* Subtitle list & Micro sync micro-corrector */}
            <TimelineTracks
              subtitles={subtitles}
              currentTime={currentTime}
              onSelectTime={handleSelectTime}
              onUpdateSubtitleText={handleUpdateSubtitleText}
              onResetSubtitles={handleResetSubtitles}
            />
            
          </div>

          {/* RIGHT AREA: Fact Check companion & AI Analyzer (size 5/12) */}
          <div className="lg:col-span-5 space-y-6">
            
            <FactCheckPanel currentSubtitle={currentSubtitle} />
            
          </div>

        </div>

        {/* Dynamic educational glossary explaining the core principles */}
        <section className="bg-white border border-[#E6E4DD] rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <ShieldAlert className="w-5 h-5 text-[#8C2D19]" />
            <h3 className="font-bold text-gray-900 text-base tracking-tight">
              媒體識讀素養學堂 ‧ 核心名詞與原則對照 (Core Terms Reference)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600 leading-relaxed">
            
            <div className="space-y-1.5 p-3 rounded-lg hover:bg-gray-50/50 transition">
              <span className="font-mono font-bold text-gray-900 flex items-center gap-1">
                <span className="inline-block w-2 bg-red-650 h-2 rounded-full" />
                標籤化與刻板偏見 (Labeling)
              </span>
              <p>
                「媒體在不深入查實的情形下，會套用大眾的既定成見，把多元的人際結構化約成簡明的外在印記（警衛的尖牙、不群居的作風），以此抹滅少數派本真的人格尊嚴。」
              </p>
            </div>

            <div className="space-y-1.5 p-3 rounded-lg hover:bg-gray-50/50 transition">
              <span className="font-mono font-bold text-gray-900 flex items-center gap-1">
                <span className="inline-block w-2 bg-amber-500 h-2 rounded-full" />
                議程設定與黑手操作 (Agenda Setting)
              </span>
              <p>
                「大眾在社會上集體焦慮的事情，常非偶然發生，大都依循著某些推行其自身政治、金錢、或者統御紅利的人氏，精心操作紅線和不對比訊息。查證『誰才是最大受益者』，是識讀王道。」
              </p>
            </div>

            <div className="space-y-2 p-3.5 rounded-lg hover:bg-emerald-50/20 transition bg-emerald-50/40 border border-emerald-200/60">
              <span className="font-mono font-bold text-gray-900 flex items-center gap-1 text-xs">
                <span className="inline-block w-2 bg-emerald-600 h-2 rounded-full animate-pulse" />
                掌握 SIFT 的四個關鍵步驟
              </span>
              <div className="space-y-2.5 mt-2 text-[11px] text-gray-700 leading-relaxed font-sans">
                <div>
                  <span className="font-bold text-emerald-800">1. Stop（冷靜思考）：</span>
                  在看到令人驚訝的影片或照片時，先停下分享的衝動，避免情緒被煽動。
                </div>
                <div>
                  <span className="font-bold text-emerald-800">2. Investigate the source（調查來源）：</span>
                  查詢有關發布者或該圖片的背景資訊，判斷其是否具備公信力。
                </div>
                <div>
                  <span className="font-bold text-emerald-805">3. Find better coverage（尋找佐證）：</span>
                  確認是否有其他權威媒體或事實查核機構對同一事件進行報導。
                </div>
                <div>
                  <span className="font-bold text-emerald-810">4. Trace claims, quotes, and media to their original context（追溯原始脈絡）：</span>
                  透過回溯原始發布環境，確認內容是否被斷章取義或誤導使用。
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Compact footer area */}
      <footer className="border-t border-[#E6E4DD] bg-white py-6 px-4 shrink-0 text-center text-xs text-gray-500 font-mono">
        <p className="max-w-2xl mx-auto leading-relaxed">
          微光識讀 (Sentry of Truth) © 2026. Designed with meticulous details to empower media literacy education across generational cohorts.
        </p>
      </footer>
    </div>
  );
}
