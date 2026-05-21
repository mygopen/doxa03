# 微光識讀 Episode 3

一個可獨立部署的 Vite/React 靜態網頁，用來播放 `my-video-bucket/e03.mp4`，並同步顯示中文字幕、時間軌與媒體識讀解析。

## R2 影片設定

Cloudflare Dashboard 的物件管理頁不能直接給瀏覽器 `<video>` 播放。這個 bucket 目前已啟用 Public Development URL，影片會預設從這裡載入：

```text
https://pub-db2385bfceac49e69829e162fbed9b57.r2.dev/e03.mp4
```

若之後改用正式自訂網域，請把公開的 MP4 物件網址放進 `.env.local`：

```bash
VITE_R2_VIDEO_URL=https://your-public-r2-domain.example/e03.mp4
```

也可以參考 `.env.example`。

## 本機開發

```bash
npm install
npm run dev
```

## 建置獨立網頁

```bash
npm run build
```

建置完成後，`dist/` 目錄就是可部署到 Cloudflare Pages、Netlify、Vercel、GitHub Pages，或任何靜態網站主機的獨立網頁。
