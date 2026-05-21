import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// Media Literacy News/Rumor Fact-checking and Cognitive Biases Analyzer API
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return res.status(400).json({ error: "請輸入需要分析的新聞內容或謠言陳述。" });
    }

    if (!ai) {
      return res.status(500).json({ 
        error: "未在伺服器端配置 GEMINI_API_KEY。請在 Settings > Secrets 裡配對設定。" 
      });
    }

    const systemPrompt = `你是一位專業的媒體識讀（Media Literacy）與事實查核專家。你的任務是客觀分析使用者提供的一段社會輿論、新聞或傳聞。請從以下四個維度進行深度解析：
1. 刻板印象與群體偏見（Stereotyping & Bias）：是否對特定族群（如特定性別、信仰、身份者）貼標籤、產生偏見或妖魔化。
2. 情緒字眼與情緒煽動（Emotional Manipulation）：是否包含煽動大眾恐慌、憤怒、或過度悲傷的詞語和表現手法。
3. 事實與觀點混淆（Fact vs. Opinion）：哪些是可被查證的具體事實？哪些是未經證實的片面觀點或主觀猜測？
4. 隱藏動機與利益操控（Hidden Agenda & Intention）：這種傳言被散播時，背後可能對誰有利？可能如何被幕後黑手用來製造社會集體恐慌以獲利？

請用繁體中文（zh-TW）回覆，格式為 JSON，結構如下：
{
  "biasScore": 75, // 0-100 的偏見/不實度評分，越接近 100 表示偏見或不實感越強。
  "scandalAnalysis": "一到兩句的簡明撮要分析。",
  "biasReport": "詳細分析刻板印象和偏見的部分。",
  "emotionalReport": "分析情緒渲染或恐慌煽動的手法。",
  "factvsOpinion": [
    {"type": "fact", "text": "這部分是事實的描述。"},
    {"type": "opinion", "text": "這部分是主觀觀點或流言臆測。"}
  ],
  "agendaReport": "分析這背後可能的利益操控、輿論操縱、社會分裂動機。",
  "tipsForCitizen": "給公民的媒體素養查證指引（1至2點，條列式）。"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `需要分析的新聞/謠言內容如下：\n\"\"\"\n${content}\n\"\"\"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "biasScore", 
            "scandalAnalysis", 
            "biasReport", 
            "emotionalReport", 
            "factvsOpinion", 
            "agendaReport", 
            "tipsForCitizen"
          ],
          properties: {
            biasScore: { type: Type.INTEGER, description: "0到100的偏見與不實渲染指數" },
            scandalAnalysis: { type: Type.STRING, description: "簡撮分析" },
            biasReport: { type: Type.STRING, description: "刻板偏見深度解析" },
            emotionalReport: { type: Type.STRING, description: "情緒字眼與恐慌煽讀分析" },
            factvsOpinion: {
              type: Type.ARRAY,
              description: "事實與觀點的列表對比",
              items: {
                type: Type.OBJECT,
                required: ["type", "text"],
                properties: {
                  type: { type: Type.STRING, description: "可以是 'fact' 或 'opinion' 二者之一" },
                  text: { type: Type.STRING, description: "具體描述內容" }
                }
              }
            },
            agendaReport: { type: Type.STRING, description: "可能動機或利益操縱分析" },
            tipsForCitizen: { type: Type.STRING, description: "給一般大眾、公民的媒體素養辨識指南建議" }
          }
        }
      }
    });

    const resultText = response.text ? response.text.trim() : "{}";
    res.json(JSON.parse(resultText));
  } catch (error: any) {
    console.error("Gemini API Error in backend:", error);
    res.status(500).json({ error: "伺服器分析失敗，請重試。錯誤詳情: " + error.message });
  }
});

// Vite Middleware Integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MediaLiteracyServer] running on http://localhost:${PORT}`);
  });
}

startServer();
