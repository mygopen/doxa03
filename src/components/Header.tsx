import { Eye, ShieldAlert, Award } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-[#E6E4DD] bg-white py-6 px-4 md:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Title Group */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-[#8C2D19] px-2.5 py-0.5 text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Episode 3 宗教篇
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-amber-100 text-amber-800 px-2.5 py-0.5 text-xs font-semibold font-mono">
              <ShieldAlert className="w-3.5 h-3.5" /> 媒體素養專案
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] tracking-tight flex items-center gap-2 mt-1">
            <Eye className="w-8 h-8 text-[#8C2D19]" />
            微光識讀 <span className="text-gray-400 font-light">| 輿論真相探查器</span>
          </h1>
          <p className="text-sm text-gray-500 font-mono">
            Sentry of Truth — Media Literacy & Interactive Subtitle Companion
          </p>
        </div>

        {/* Philosophy Card */}
        <div className="bg-[#FAF9F5] border border-[#E6E4DD] rounded-lg p-4 max-w-md text-xs text-gray-600 leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-[#8C2D19] mb-1.5 font-mono">
            <Award className="w-4 h-4" /> 課堂引導與公民指南
          </div>
          本平台特別針對
          <strong>《Episode 3：宗教/少數身份篇》</strong>動畫短片，建立點對點精確 timeline 中文字幕與深入解碼。旨在引導觀賞者反思媒體的「標籤化抹黑」、「假新聞炒作」與「幕後利益操縱」，培養理性查證、拒絕盲從之核心公民素養。
        </div>
      </div>
    </header>
  );
}
