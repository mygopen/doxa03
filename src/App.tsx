import { useState } from "react";
import Header from "./components/Header";
import StoryboardView from "./components/StoryboardView";
import TimelineTracks from "./components/TimelineTracks";
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
    <div className="sketch-page flex min-h-screen flex-col text-[var(--pencil)] selection:bg-[var(--marker-red)] selection:text-white">
      {/* Universal introduction banner */}
      <Header />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-5xl flex-grow space-y-8 p-4 md:p-6 lg:p-8">
        
        {/* Full-width player and subtitle editor */}
        <div className="space-y-6">
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

          <TimelineTracks
            subtitles={subtitles}
            currentTime={currentTime}
            onSelectTime={handleSelectTime}
            onUpdateSubtitleText={handleUpdateSubtitleText}
            onResetSubtitles={handleResetSubtitles}
          />
        </div>

        {/* Dynamic educational glossary explaining the core principles */}
        <section className="sketch-card relative space-y-5 p-6">
          <span className="sketch-tape" />
          <div className="flex items-center gap-3 border-b-2 border-dashed border-[var(--pencil)] pb-4">
            <span className="inline-flex h-11 w-11 -rotate-6 items-center justify-center border-[3px] border-[var(--pencil)] bg-[var(--post-it)] shadow-[3px_3px_0_0_var(--pencil)]" style={{ borderRadius: "54% 44% 49% 47% / 45% 57% 42% 53%" }}>
              <ShieldAlert className="h-6 w-6 text-[var(--marker-red)]" strokeWidth={3} />
            </span>
            <h3 className="font-sketch-heading text-3xl leading-tight text-[var(--pencil)] md:text-4xl">
              媒體識讀核心原則對照
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-6 text-lg leading-relaxed md:grid-cols-3">
            
            <div className="sketch-card-soft -rotate-1 space-y-2 bg-white p-4 transition-transform duration-100 hover:rotate-0">
              <span className="font-sketch-heading flex items-center gap-2 text-2xl text-[var(--pencil)]">
                <span className="inline-block h-3 w-3 bg-[var(--marker-red)]" style={{ borderRadius: "50% 42% 55% 45% / 48% 54% 44% 52%" }} />
                標籤化與刻板偏見 (Labeling)
              </span>
              <p>
                「媒體在不深入查實的情形下，會套用大眾的既定成見，把多元的人際結構化約成簡明的外在印記（警衛的尖牙、不群居的作風），以此抹滅少數派本真的人格尊嚴。」
              </p>
            </div>

            <div className="sketch-postit rotate-1 space-y-2 p-4 transition-transform duration-100 hover:rotate-0">
              <span className="font-sketch-heading flex items-center gap-2 text-2xl text-[var(--pencil)]">
                <span className="inline-block h-3 w-3 bg-[var(--ballpoint)]" style={{ borderRadius: "45% 55% 46% 54% / 55% 43% 57% 45%" }} />
                議程設定與黑手操作 (Agenda Setting)
              </span>
              <p>
                批判性反思提問：「如果媒體上到處在討論某個少數信仰或偏遠族群極其怪誕的行為，你會直接相信、還是會向多重、具有公信力事實來源來查證呢？」
              </p>
            </div>

            <div className="sketch-card-soft -rotate-[0.5deg] space-y-3 bg-white p-4 transition-transform duration-100 hover:rotate-0">
              <span className="font-sketch-heading flex items-center gap-2 text-2xl text-[var(--pencil)]">
                <span className="inline-block h-3 w-3 animate-pulse bg-[var(--marker-red)]" style={{ borderRadius: "52% 42% 56% 44% / 45% 58% 43% 52%" }} />
                掌握 SIFT 的四個關鍵步驟
              </span>
              <div className="mt-2 space-y-3 text-lg leading-relaxed">
                <div>
                  <span className="font-sketch-heading text-[var(--ballpoint)]">1. Stop（冷靜思考）：</span>
                  在看到令人驚訝的影片或照片時，先停下分享的衝動，避免情緒被煽動。
                </div>
                <div>
                  <span className="font-sketch-heading text-[var(--ballpoint)]">2. Investigate the source（調查來源）：</span>
                  查詢有關發布者或該圖片的背景資訊，判斷其是否具備公信力。
                </div>
                <div>
                  <span className="font-sketch-heading text-[var(--ballpoint)]">3. Find better coverage（尋找佐證）：</span>
                  確認是否有其他權威媒體或事實查核機構對同一事件進行報導。
                </div>
                <div>
                  <span className="font-sketch-heading text-[var(--ballpoint)]">4. Trace claims, quotes, and media to their original context：</span>
                  透過回溯原始發布環境，確認內容是否被斷章取義或誤導使用。
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Compact footer area */}
      <footer className="shrink-0 px-4 py-8 text-center text-lg text-[var(--pencil)]/65">
        <p className="mx-auto max-w-2xl border-t-2 border-dashed border-[var(--pencil)] pt-5 leading-relaxed">
          DoxA 鐘響 © 2026. Designed with MyGoPen x 復興商工｜廣三義｜媒體動畫組｜第五組
        </p>
      </footer>
    </div>
  );
}
