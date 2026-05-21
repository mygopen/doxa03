import { useState, type DragEvent } from "react";
import { Check, Grip, MousePointer2, RotateCcw } from "lucide-react";

type SiftTerm = {
  id: string;
  label: string;
  hint: string;
};

type SiftQuestion = {
  id: string;
  prompt: string;
  correctTermId: string;
};

const terms: SiftTerm[] = [
  {
    id: "stop",
    label: "Stop（冷靜思考）",
    hint: "先停下分享衝動，避免被情緒推著走。",
  },
  {
    id: "investigate",
    label: "Investigate the source（調查來源）",
    hint: "先查發布者、帳號、網站或截圖來源是否可信。",
  },
  {
    id: "find",
    label: "Find better coverage（尋找佐證）",
    hint: "找更可靠的報導、查核或權威資料交叉比對。",
  },
  {
    id: "trace",
    label: "Trace original context（回溯原始脈絡）",
    hint: "回到原始影片、照片或引言，確認是否被斷章取義。",
  },
];

const questions: SiftQuestion[] = [
  {
    id: "q1",
    prompt: "看到一支影片宣稱某個少數信仰都很危險，讓你很想立刻轉傳提醒朋友。",
    correctTermId: "stop",
  },
  {
    id: "q2",
    prompt: "你看到一張來源不明的截圖，想先知道發布者、網站或帳號是否可靠。",
    correctTermId: "investigate",
  },
  {
    id: "q3",
    prompt: "同一個指控只有單一帳號在傳，你想找權威媒體或事實查核單位佐證。",
    correctTermId: "find",
  },
];

const getTerm = (termId: string | undefined) =>
  terms.find((term) => term.id === termId);

export default function SiftDragGame() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [dragOverQuestionId, setDragOverQuestionId] = useState<string | null>(null);

  const score = questions.filter((question) => answers[question.id] === question.correctTermId).length;
  const isComplete = score === questions.length;
  const usedTermIds = new Set(Object.values(answers));
  const availableTerms = terms.filter((term) => !usedTermIds.has(term.id));

  const placeTerm = (questionId: string, termId: string) => {
    setAnswers((current) => {
      const next = { ...current };

      Object.entries(next).forEach(([existingQuestionId, existingTermId]) => {
        if (existingTermId === termId) {
          delete next[existingQuestionId];
        }
      });

      next[questionId] = termId;
      return next;
    });
    setSelectedTermId(null);
  };

  const removeTerm = (questionId: string) => {
    setAnswers((current) => {
      const next = { ...current };
      delete next[questionId];
      return next;
    });
  };

  const handleDragStart = (event: DragEvent<HTMLElement>, termId: string) => {
    event.dataTransfer.setData("text/plain", termId);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (event: DragEvent<HTMLElement>, questionId: string) => {
    event.preventDefault();
    const termId = event.dataTransfer.getData("text/plain");

    if (terms.some((term) => term.id === termId)) {
      placeTerm(questionId, termId);
    }

    setDragOverQuestionId(null);
  };

  const resetGame = () => {
    setAnswers({});
    setSelectedTermId(null);
    setDragOverQuestionId(null);
  };

  return (
    <div className="relative border-t-2 border-dashed border-[var(--pencil)] pt-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="sketch-tag -rotate-1 bg-white text-sm text-[var(--ballpoint)]">
            <MousePointer2 className="h-4 w-4" strokeWidth={3} /> 拖曳文字方塊名詞
          </span>
          <h4 className="font-sketch-heading mt-3 text-3xl leading-tight text-[var(--pencil)]">
            SIFT 觀念配對拖拉放
          </h4>
          <p className="mt-1 text-lg leading-relaxed text-[var(--pencil)]/70">
            把名詞紙條拖到對應情境；手機可以先點名詞，再點答案格。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`sketch-tag text-base ${isComplete ? "bg-[var(--post-it)] text-[var(--ballpoint)]" : "bg-white"}`}>
            {isComplete ? "全部答對！" : `已答對 ${score} / ${questions.length}`}
          </span>
          <button className="sketch-button sketch-button-secondary text-base" onClick={resetGame} type="button">
            <RotateCcw className="h-4 w-4" strokeWidth={3} /> 重玩
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="sketch-card-soft -rotate-[0.4deg] bg-white p-4">
          <div className="font-sketch-heading mb-3 text-2xl text-[var(--pencil)]">
            名詞紙條
          </div>
          <div className="flex flex-wrap gap-3">
            {availableTerms.map((term) => {
              const isSelected = selectedTermId === term.id;

              return (
                <button
                  className={`sketch-button min-h-0 cursor-grab px-3 py-2 text-left text-base active:cursor-grabbing ${
                    isSelected ? "bg-[var(--ballpoint)] text-white" : "bg-[var(--post-it)]"
                  }`}
                  draggable
                  key={term.id}
                  onClick={() => setSelectedTermId(isSelected ? null : term.id)}
                  onDragStart={(event) => handleDragStart(event, term.id)}
                  title={term.hint}
                  type="button"
                >
                  <Grip className="h-4 w-4 shrink-0" strokeWidth={3} />
                  <span>{term.label}</span>
                </button>
              );
            })}
            {availableTerms.length === 0 && (
              <p className="text-lg text-[var(--pencil)]/65">所有紙條都已放進答案格。</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((question, index) => {
            const placedTerm = getTerm(answers[question.id]);
            const isCorrect = placedTerm?.id === question.correctTermId;
            const isWrong = Boolean(placedTerm) && !isCorrect;
            const isDragOver = dragOverQuestionId === question.id;

            return (
              <div
                className={`border-2 p-4 transition-transform duration-100 ${
                  isCorrect
                    ? "border-[var(--ballpoint)] bg-[rgba(45,93,161,0.08)]"
                    : isWrong
                      ? "border-[var(--marker-red)] bg-white"
                      : isDragOver
                        ? "border-[var(--ballpoint)] bg-[var(--post-it)]"
                        : "border-dashed border-[var(--pencil)] bg-white"
                }`}
                key={question.id}
                onClick={() => {
                  if (selectedTermId) {
                    placeTerm(question.id, selectedTermId);
                  }
                }}
                onDragLeave={() => setDragOverQuestionId(null)}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOverQuestionId(question.id);
                }}
                onDrop={(event) => handleDrop(event, question.id)}
                style={{ borderRadius: "23px 14px 27px 16px / 15px 26px 14px 25px" }}
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="text-lg leading-snug">
                    <span className="font-sketch-heading mr-2 text-2xl text-[var(--marker-red)]">
                      Q{index + 1}
                    </span>
                    {question.prompt}
                  </div>

                  <div className="min-w-[230px]">
                    {placedTerm ? (
                      <button
                        className={`sketch-button w-full min-h-0 justify-between px-3 py-2 text-left text-base ${
                          isCorrect ? "bg-[var(--post-it)] text-[var(--ballpoint)]" : "bg-white text-[var(--pencil)]"
                        }`}
                        draggable
                        onClick={(event) => {
                          event.stopPropagation();
                          removeTerm(question.id);
                        }}
                        onDragStart={(event) => handleDragStart(event, placedTerm.id)}
                        title="點一下可把紙條拿回名詞池"
                        type="button"
                      >
                        <span>{placedTerm.label}</span>
                        {isCorrect && <Check className="h-5 w-5 shrink-0" strokeWidth={3} />}
                      </button>
                    ) : (
                      <div className="border-2 border-dashed border-[var(--pencil)] bg-[rgba(229,224,216,0.45)] px-4 py-3 text-center text-lg text-[var(--pencil)]/55" style={{ borderRadius: "20px 12px 18px 14px / 14px 20px 12px 18px" }}>
                        放到這裡
                      </div>
                    )}
                    {isWrong && (
                      <p className="mt-2 text-base font-bold text-[var(--marker-red)]">
                        再想一下，這張紙條還不是最適合的位置。
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
