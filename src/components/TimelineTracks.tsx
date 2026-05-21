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
    <div className="sketch-card relative overflow-visible">
      <span className="sketch-tape" />
      {/* Widget Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-dashed border-[var(--pencil)] px-6 py-5">
        <div>
          <h2 className="font-sketch-heading flex items-center gap-2 text-3xl text-[var(--pencil)]">
            <Clock className="h-6 w-6 text-[var(--ballpoint)]" strokeWidth={3} />
            中文字幕與 Timeline 核校編輯軌
          </h2>
          <p className="mt-1 text-lg text-[var(--pencil)]/70">
            可點擊時間直接跳轉播放；點擊編輯可原地微調中文字幕內容。
          </p>
        </div>

        {/* Restore Defaults */}
        <button
          onClick={onResetSubtitles}
          className="sketch-button sketch-button-secondary text-lg"
          title="回復專業中文字幕與詳細媒體識讀分析"
        >
          <RotateCcw className="h-4 w-4" strokeWidth={3} /> 重設預設字幕
        </button>
      </div>

      {/* Track List Container */}
      <div className="max-h-[520px] space-y-3 overflow-y-auto p-4">
        {subtitles.map((item) => {
          const isActive = currentTime >= item.startTime && currentTime <= item.endTime;
          const isCurrentlyEditing = editingId === item.id;

          return (
            <div
              key={item.id}
              className={`sketch-row flex flex-col justify-between gap-3 p-3 text-lg transition-transform duration-100 md:flex-row md:items-center md:p-4 ${
                isActive 
                  ? "sketch-row-active" 
                  : "hover:-rotate-[0.25deg] hover:bg-white/70"
              }`}
            >
              {/* Timeline Indicator Badge */}
              <button
                onClick={() => onSelectTime(item.startTime)}
                className={`inline-flex flex-shrink-0 items-center gap-1 border-2 border-[var(--pencil)] px-3 py-1.5 text-left font-bold shadow-[2px_2px_0_0_var(--pencil)] transition-transform duration-100 hover:rotate-1 ${
                  isActive 
                    ? "bg-[var(--marker-red)] text-white" 
                    : "bg-[var(--old-paper)] text-[var(--pencil)]"
                }`}
                style={{ borderRadius: "18px 10px 16px 12px / 12px 18px 10px 16px" }}
                title="點擊跳轉到此時間播放"
              >
                <Clock className="h-4 w-4" strokeWidth={3} />
                <span>{formatTime(item.startTime)} - {formatTime(item.endTime)}</span>
              </button>

              {/* Text Container: Static Text or Inline Editor Input */}
              <div className="flex-1 md:mx-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`sketch-tag px-2 py-1 text-sm ${
                    isActive ? "bg-white text-[var(--marker-red)]" : "bg-white text-[var(--pencil)]"
                  }`}>
                    {item.speaker}
                  </span>
                  <span className="text-sm font-bold text-[var(--pencil)]/55">
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
                      className="sketch-input flex-grow px-3 py-2 text-lg"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="sketch-icon-button bg-[var(--ballpoint)] text-white"
                      title="確認儲存"
                    >
                      <Check className="h-5 w-5" strokeWidth={3} />
                    </button>
                  </div>
                ) : (
                  <p className={`text-lg leading-relaxed md:text-xl ${
                    isActive ? "font-bold text-[var(--pencil)]" : "text-[var(--pencil)]/85"
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
                    className="sketch-icon-button"
                    title="修訂這句字幕"
                  >
                    <Edit3 className="h-5 w-5" strokeWidth={3} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tracks Footer Info hint */}
      <div className="flex items-center justify-between border-t-2 border-dashed border-[var(--pencil)] px-6 py-3 text-base text-[var(--pencil)]/60">
        <span className="flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-[var(--marker-red)]" strokeWidth={3} />
          微調即時回寫模擬器
        </span>
        <span>共計 {subtitles.length} 個同步字幕片段</span>
      </div>
    </div>
  );
}
