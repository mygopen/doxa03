import { Award, ShieldAlert, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="px-4 py-6 md:px-8 md:py-8">
      <div className="relative mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="absolute -left-2 top-1 hidden h-10 w-10 rotate-12 border-[3px] border-dashed border-[var(--pencil)] md:block" style={{ borderRadius: "50% 42% 53% 45% / 45% 55% 40% 50%" }} />
        <div className="absolute -right-3 bottom-3 hidden text-[var(--marker-red)] md:block">
          <Sparkles className="h-8 w-8 sketch-bob" strokeWidth={3} />
        </div>

        {/* Title Group */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="sketch-tag -rotate-1 bg-[var(--marker-red)] text-sm text-white">
              Episode 3 宗教篇
            </span>
            <span className="sketch-tag rotate-1 bg-[var(--post-it)] text-sm">
              <ShieldAlert className="h-4 w-4" strokeWidth={3} /> 媒體素養專案
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <img
              src="https://ik.imagekit.io/mygopen/doxa-logo.png"
              alt="DoxA 鐘響"
              className="h-auto w-full max-w-[360px] -rotate-1 object-contain md:max-w-[430px]"
            />
            <h1 className="font-sketch-heading text-3xl leading-tight text-[var(--ballpoint)] md:text-4xl">
              貼標籤｜因為大家都這樣說啊
            </h1>
          </div>
          <p className="max-w-xl text-xl leading-snug text-[var(--pencil)]/75">
            面對未知與大眾既定認知資訊，你必須學會拆解傳言
          </p>
        </div>

        {/* Philosophy Card */}
        <div className="sketch-postit relative max-w-md rotate-1 p-5 text-lg leading-relaxed">
          <span className="sketch-tape" />
          <div className="font-sketch-heading mb-2 flex items-center gap-2 text-xl text-[var(--marker-red)]">
            <Award className="h-5 w-5" strokeWidth={3} /> 課堂引導與公民指南
          </div>
          本平台特別針對
          <strong>《Episode 3：宗教/少數身份篇》</strong>動畫短片，建立點對點 timeline 中文字幕。請一邊看，一邊把可疑訊息停下來查。
        </div>
      </div>
    </header>
  );
}
