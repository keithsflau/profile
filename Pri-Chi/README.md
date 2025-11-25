# Pri-Chi 小學語文學習平台

Pri-Chi 是一個整合多個語文學習套件的平台，提供互動式的語文學習體驗。

## 📁 專案結構

```
Pri-Chi/
├── docs/                          # GitHub Pages 部署資料夾
│   ├── index.html                # Portal 入口頁面
│   └── assets/                   # 靜態資源
├── portal/                        # 所有學習套件的組織資料夾
│   ├── language_monopoly/        # 語文大富翁遊戲套件
│   │   ├── webapp/               # React + Vite 互動網頁版
│   │   ├── board_layout.csv      # 棋盤配置
│   │   ├── cards_*.csv           # 卡片資料
│   │   └── README.md             # 套件說明
│   └── [其他套件]/                # 未來可以加入更多套件
└── README.md                      # 本檔案
```

## 🚀 快速開始

### 訪問 Portal 入口

1. **線上訪問**: `https://keithsflau.github.io/primarychi/`
   - 這是主要的入口頁面，可以從這裡訪問所有套件

### 開發環境設置

1. 克隆倉庫：
   ```bash
   git clone https://github.com/keithsflau/primarychi.git
   cd primarychi
   ```

2. 選擇要開發的套件，例如 `language_monopoly`：
   ```bash
   cd portal/language_monopoly/webapp
   npm install
   npm run dev
   ```

## 📦 可用套件

### 🎮 Language Monopoly (語文大富翁)

互動式中國語文學習遊戲，透過大富翁遊戲學習成語、部首、詩詞等語文知識。

- **位置**: `portal/language_monopoly/`
- **網頁版**: `portal/language_monopoly/webapp/`
- **詳細說明**: 請參考 `portal/language_monopoly/README.md`

### 未來套件

更多學習套件將陸續加入 `portal/` 資料夾中。

## 🔧 如何新增套件

1. 在 `portal/` 下創建新的套件資料夾
2. 在該資料夾中添加套件內容
3. 在 `docs/index.html` 中添加新的套件卡片
4. 更新 `portal/README.md` 文件

## 📝 開發說明

- **GitHub Pages**: 部署在 `docs/` 資料夾，設定為 main branch 的 /docs 資料夾
- **入口頁面**: `docs/index.html` 是 Portal 的主入口頁面
- **套件組織**: 所有套件都組織在 `portal/` 資料夾下，便於管理和擴展

## 📄 授權

本專案相關授權請參考各套件的說明文件。

## 🤝 貢獻

歡迎提出建議和改進！請在 GitHub 上提交 Issue 或 Pull Request。

