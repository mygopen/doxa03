import { useState } from "react";
import { Edit3, Check, RotateCcw, Clock, Sparkles } from "lucide-react";
import { SubtitleItem } from "../types";

interface TimelineTracksProps {
  subtitles: SubtitleItem[];
  currentTime: number;
  onSelectTime: (time: number) => void;
  onUpdateSubtitleText: (id: string, text: string) => void;
  onResetSubtitles: () => void;
}

export default function TimelineTracks({
  subtitles,
  currentTime,
  onSelectTime,
  onUpdateSubtitleText,
  onResetSubtitles
}: TimelineTracksProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartEdit = (item: SubtitleItem) => {
    setEditingId(item.id);
    setEditValue(item.text);
  };

  const handleSaveEdit = (id: string) => {
    onUpdateSubtitleText(id, editValue);
    setEditingId(null);
  };

  return (
    <div className="bg-white border border-[#E6E4DD] rounded-xl shadow-xs overflow-hidden">
      {/* Widget Header */}
      <div className="px-6 py-4 border-b border-[#E6E4DD] bg-[#FAF9F5] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-bold text-lg text-gray-900 tracking-tight flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8C2D19]" />
            中文字幕與 Timeline 核校編輯軌
          </h2>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            可點擊時間直接跳轉播放；點擊編輯可原地微調中文字幕內容。
          </p>
        </div>

        {/* Restore Defaults */}
        <button
          onClick={onResetSubtitles}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E4DD] bg-white text-xs font-semibold text-gray-600 hover:text-[#8C2D19] hover:bg-[#FAF9F5] transition-all duration-150"
          title="回復專業中文字幕與詳細媒體識讀分析"
        >
          <RotateCcw className="w-3.5 h-3.5" /> 重設預設字幕
        </button>
      </div>

      {/* Track List Container */}
      <div className="p-4 max-h-[460px] overflow-y-auto divide-y divide-gray-100">
        {subtitles.map((item) => {
          const isActive = currentTime >= item.startTime && currentTime <= item.endTime;
          const isCurrentlyEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className={`p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-sm transition-all duration-150 ${
                isActive 
                  ? "bg-amber-50/70 border-l-4 border-[#8C2D19] -ml-4 pl-4 rounded-r-lg" 
                  : "hover:bg-gray-50/50"
              }`}
            >
              {/* Timeline Indicator Badge */}
              <button
                onClick={() => onSelectTime(item.startTime)}
                className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold font-mono tracking-wider text-left transition-all hover:scale-105 ${
                  isActive 
                    ? "bg-[#8C2D19] text-white shadow-xs" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="點擊跳轉到此時間播放"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
              </button>

              {/* Text Container: Static Text or Inline Editor Input */}
              <div className="flex-1 md:mx-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-bold font-mono px-1.5 py-0.5 rounded ${
                    isActive ? "bg-amber-100 text-[#8C2D19]" : "bg-gray-100 text-gray-500"
                  }`}>
                    {item.speaker}
                  </span>
                  <span className="text-[11px] text-gray-400 font-medium">
                    {item.sceneTitle}
                  </span>
                </div>

                {isCurrentlyEditing ? (
                  <div className="flex items-center gap-2 mt-1.5 w-full">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(item.id)}
                      className="flex-grow text-sm border border-gray-300 rounded px-2.5 py-1.5 bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#8C2D19]"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                      title="確認儲存"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <p className={`text-sm md:text-base leading-relaxed ${
                    isActive ? "font-bold text-[#1A1A1A]" : "text-gray-700"
                  }`}>
                    {item.text}
                  </p>
                )}
              </div>

              {/* Inline Editor Edit Buttons Action */}
              <div className="flex-shrink-0 flex items-center justify-end">
                {!isCurrentlyEditing && (
                  <button
                    onClick={() => handleStartEdit(item)}
                    className="p-2 text-gray-400 hover:text-[#8C2D19] hover:bg-gray-50 rounded-lg transition-colors duration-150"
                    title="修訂這句字幕"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracks Footer Info hint */}
      <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-[11px] text-gray-400 font-mono">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          微調即時回寫模擬器
        </span>
        <span>共計 {subtitles.length} 個同步字幕片段</span>
      </div>
    </div>
  );
}
