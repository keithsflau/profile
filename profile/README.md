# Web Apps Portfolio

這是我的互動式教學應用程式集合入口頁面。

## 🚀 設置 GitHub Pages

### 方法 1: 使用 profile 目錄作為 GitHub Pages 源

1. 前往你的 GitHub 倉庫設置頁面
2. 進入 **Settings** > **Pages**
3. 在 **Source** 部分，選擇：
   - **Branch**: `main` (或你的主分支)
   - **Folder**: `/profile`
4. 點擊 **Save**
5. 你的頁面將在 `https://[你的用戶名].github.io/[倉庫名]/` 可用

### 方法 2: 使用 gh-pages 分支

如果你想要更靈活的部署方式，可以：

1. 創建一個 `gh-pages` 分支
2. 將 `profile` 目錄的內容複製到分支根目錄
3. 在 GitHub Pages 設置中選擇 `gh-pages` 分支作為源

## 📁 項目結構

```
github/
├── profile/
│   ├── index.html          # 入口頁面
│   └── README.md          # 本文件
├── F2_JS_BioCycle/        # 生物循環模擬
├── F2-JS-Ohm-s-Law/       # 歐姆定律模擬
├── Bernoulli-Simulation/   # 伯努利原理模擬
├── F3-Math-Four-Centres/  # 三角形四心學習
├── Pri-Chi/               # 小學語文學習平台
└── Hong_Kong_Tycoon_Dream/ # 香江富豪夢遊戲
```

## 🔗 訪問鏈接

設置完成後，你可以通過以下方式訪問：

- 如果倉庫名是 `username.github.io`: `https://username.github.io/`
- 如果倉庫名是其他: `https://username.github.io/[倉庫名]/`

## 📝 注意事項

- 確保所有項目的相對路徑正確
- 如果路徑不正確，可能需要調整 `index.html` 中的鏈接
- **重要**: Pri-Chi 的 Language Monopoly 需要先構建才能使用：
  ```bash
  cd Pri-Chi/portal/language_monopoly/webapp
  npm install
  npm run build
  ```
  構建完成後，`dist` 目錄中的文件將可用於 GitHub Pages

## 🛠️ 本地測試

在本地測試時，可以使用 Python 簡單服務器：

```bash
cd profile
python -m http.server 8000
```

然後在瀏覽器中訪問 `http://localhost:8000`
