import { HelpCircle, Eye } from "lucide-react";
import { SubtitleItem } from "../types";

interface FactCheckPanelProps {
  currentSubtitle: SubtitleItem | null;
}

export default function FactCheckPanel({ currentSubtitle }: FactCheckPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-6">
      
      {/* 1. SECTION: Real-time Playback Literacy Coach Guide */}
      <div className="bg-[#FAF9F5] border border-[#E6E4DD] rounded-xl p-5 md:p-6 space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E6E4DD]">
          <Eye className="w-5 h-5 text-[#8C2D19]" />
          <div>
            <h3 className="font-bold text-gray-900 tracking-tight text-base">
              當前劇幕 ‧ 媒體識讀極速解碼
            </h3>
            <p className="text-[11px] text-gray-500 font-mono">
              隨著影片播放，實時同步對應劇情在真實新聞環境中的象徵意義一覽。
            </p>
          </div>
        </div>

        {currentSubtitle ? (
          <div className="space-y-4 transition-all duration-300">
            {/* Theme Badge Title */}
            <div>
              <span className="inline-block px-2 py-0.5 rounded bg-white border border-[#E6E4DD] text-[#8C2D19] text-xs font-bold font-mono">
                {currentSubtitle.sceneTitle}
              </span>
              <p className="text-sm font-semibold text-[#1A1A1A] mt-1.5 font-mono">
                當前語意: 「{currentSubtitle.text.length > 55 ? `${currentSubtitle.text.slice(0, 55)}...` : currentSubtitle.text}」
              </p>
            </div>

            {/* In-depth Analysis Section */}
            <div className="text-xs text-gray-700 leading-relaxed bg-white border border-[#E1DFD7] rounded-lg p-4 shadow-3xs relative overflow-hidden">
              <span className="absolute top-0 right-0 w-20 h-20 bg-[#8C2D19]/5 rounded-bl-full pointer-events-none" />
              <p>{currentSubtitle.sceneDesc}</p>
            </div>

            {/* Reflective Literacy Prompts */}
            <div className="bg-amber-50/50 border border-amber-100 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                批判性反思提問:
              </div>
              <p className="text-xs text-amber-900 leading-relaxed font-sans">
                {currentSubtitle.id === "sub-7" || currentSubtitle.id === "sub-6" ? (
                  "「在當下的社群媒體，我們是否也看過類似的『點擊誘餌標題』？當看到『驚爆、秘辛』這類用字時，你的第一直覺通常是什麼？」"
                ) : currentSubtitle.id === "sub-8" || currentSubtitle.id === "sub-9" || currentSubtitle.id === "sub-10" ? (
                  "「為什麼當眾人集體陷入恐慌時，連原本互信的伙伴、無害的生理特徵（比如牙齒、膚色、信仰習慣）都會突然被當成邪惡的鐵證？這在社會學上如何被解釋？」"
                ) : currentSubtitle.id === "sub-19" || currentSubtitle.id === "sub-20" ? (
                  "「許多煽動性言論常有特定網軍或利益群體在背後注資推廣。當看到讓你怒氣沖天的新聞時，退後一步想想：『如果我因此去討厭對方，最後是誰會從中得利？』」"
                ) : (
                  "「如果媒體上到處在討論某個少數信仰或偏遠族群極其怪誕的行為，你會直接相信、還是會向多重、公信事實來源核對？」"
                )}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 text-xs font-mono">
            請播放影片，或點選時間軌以即時顯示對應「媒體識讀」要義。
          </div>
        )}
      </div>

    </div>
  );
}
