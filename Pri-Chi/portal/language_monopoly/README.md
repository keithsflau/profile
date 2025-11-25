# 中國語文版大富翁（Language Monopoly）

這個資料夾收錄整套「小學語文冒險家」大富翁教材，可直接列印或改編使用。企劃源自既定需求，並依照大富翁核心規則（買地、建屋、抽卡、繳租、入獄等）重新設計為中國語文學習情境。

## 內容概覽

- `board_layout.csv`：40 格棋盤逐格說明，含顏色組、語文技能與停留效果。
- `cards_opportunity.csv`、`cards_fate.csv`：10 張機會卡與 10 張命運卡，皆融入語文任務。
- `rules_and_activities.md`：詳細規則、租金與貨幣設定、特殊格說明、教學延伸與配件清單。
- `webapp/`：以 React + Vite 建立的互動網頁版，可 2-4 人同步遊玩，具備擲骰、抽卡動畫及資源自動計算。

## 使用方式

1. 下載或列印棋盤：可依 `board_layout.csv` 自行排版（建議 A1/A2 大小），或將資料輸入繪圖軟體。
2. 依卡牌 CSV 內容製作卡片，可貼在硬卡紙或使用線上抽卡工具。
3. 依 `rules_and_activities.md` 執行課堂活動，內含閱讀、寫作、口語延伸與評量建議。

## 顏色組與技能

| 顏色組 | 代表技能 | 格子 |
| --- | --- | --- |
| 草綠（字詞入門） | 偏旁、象形 | 2,4 |
| 淺黃（語法運用） | 句式、修辭、字音 | 6,8,9 |
| 淺藍（寓言詩詞） | 寓言、成語、古詩 | 11,13,15 |
| 粉紅（部首挑戰） | 挑戰營、書寫、造字 | 16,18,19 |
| 橙色（寫作練習） | 說明文、日記 | 21,23 |
| 紫色（文化傳承） | 神話、故事、同義反義 | 25,27,28 |
| 紅色（技巧提升） | 標點、挑戰塔 | 30,32 |
| 深藍（高階語文） | 地方文化、短文、詩詞 | 33,36,40 |

> 註：`語文活動中心`、`語文修養室`、`餐膳補給站` 等角落維持大富翁對應功能，但情境換成中文課活動；詳細效果請見 `board_layout.csv` 與 `rules_and_activities.md`。

後續若要加入更多卡牌或格子，可在此分支繼續擴充。

## WebApp 快速啟動

1. 進入 `portal/language_monopoly/webapp`，執行 `npm install`。
2. 以 `npm run dev` 啟動本機開發伺服器（預設 http://localhost:5173）。
3. 若需多人即時同步，在 GitHub Pages 上部署前請於 `.env` 設定：
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=public-anon-key
   ```
   沒有設定時仍可本機輪流遊玩。
4. `npm run build` 會產出 `webapp/dist/`，請複製到 repo 根目錄的 `docs/` 後推送；GitHub Pages 設定為「Branch: main / Folder: /docs」即可對外提供互動版。

## Portal 結構

此套件現在位於 `portal/language_monopoly/`，作為 Primarychi Portal 的一部分。可以透過 `docs/index.html` 的入口頁面訪問。

