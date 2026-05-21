export interface SubtitleItem {
  id: string;
  startTime: number; // 秒數
  endTime: number;   // 秒數
  text: string;      // 字幕中文內容
  speaker: string;   // 說話者
  sceneTitle: string; // 場景解析主題
  sceneDesc: string; // 媒體識讀解析：這個部分的社會隱喻
  visualClue: string; // 畫面特徵描述
}

export interface FactCheckReport {
  biasScore: number;
  scandalAnalysis: string;
  biasReport: string;
  emotionalReport: string;
  factvsOpinion: Array<{ type: "fact" | "opinion"; text: string }>;
  agendaReport: string;
  tipsForCitizen: string;
}
