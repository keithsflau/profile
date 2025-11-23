# 語文大富翁 WebApp

以 **React + TypeScript + Vite** 打造的互動式「中國語文版大富翁」，支援 2-4 名玩家於瀏覽器同時遊玩，擁有以下功能：

- 40 格棋盤、顏色組技能與房地建置邏輯
- 擲骰前進、資源自動計算、租金 / 升級流程
- 機會 / 命運卡抽牌動畫（Framer Motion）
- 特殊格（圖書室、餐膳站、口語廣場）互動選項
- 可選的 Supabase Realtime 同步，讓不同裝置共用同一房間

> 若未設定即時服務，遊戲會自動退回「本機輪流」模式，不影響課堂演練。

## 快速開始

```bash
cd language_monopoly/webapp
npm install
npm run dev
```

開啟瀏覽器前往 `http://localhost:5173`。在登入畫面輸入 2-4 位玩家名稱，即可開始遊戲。

## Supabase Realtime（多人同步）

GitHub Pages 為靜態託管，因此需要第三方即時服務。若想讓多名學生在不同裝置看到同一局遊戲：

1. 建立 Supabase 專案，啟用 Realtime Database。
2. 於 `webapp/.env`（自行建立）填入：

   ```
   VITE_SUPABASE_URL=<your-project-url>
   VITE_SUPABASE_ANON_KEY=<public-anon-key>
   ```

3. 重新啟動 `npm run dev`、或 `npm run build` 後推送至 GitHub Pages。

> 未設定 `.env` 時依然可以本機遊玩，只是房間代碼會顯示為「本機模式」。

## 建置與部署

1. `npm run build` 會輸出靜態檔至 `dist/`。
2. 將 `dist` 內容複製到 `language_monopoly` 分支根目錄（或以 GitHub Actions 自動部署）即可透過 Pages 服務公開。
3. 亦可搭配 `npm run preview` 驗證正式編譯版。

## 資料來源

- 棋盤與卡片資料載入自 `../board_layout.csv` 及 `../cards_*`，若修改 CSV，可同步更新 `src/data/` 中的常數以維持前端呈現。
- 遊戲規則則對應 `../rules_and_activities.md`。

歡迎依課程需求調整 UI / 卡牌內容，或擴寫更多語文任務。若要加入語音辨識、AI 助教等功能，也可在此專案基礎上延伸。祝授課順利！***
