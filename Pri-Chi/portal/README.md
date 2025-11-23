# Primarychi Portal

這是 Primarychi 專案的入口，組織所有不同的學習套件。

## 結構說明

```
portal/
├── language_monopoly/    # 語文大富翁遊戲套件
│   ├── webapp/           # 互動網頁版
│   ├── board_layout.csv  # 棋盤配置
│   ├── cards_*.csv       # 卡片資料
│   └── README.md         # 套件說明
└── [其他套件]/            # 未來可以加入更多套件
```

## 可用套件

### 🎮 Language Monopoly (語文大富翁)

互動式中國語文學習遊戲，透過大富翁遊戲學習成語、部首、詩詞等語文知識。

- **位置**: `portal/language_monopoly/`
- **網頁版**: `portal/language_monopoly/webapp/`
- **詳細說明**: 請參考 `portal/language_monopoly/README.md`

## 如何新增套件

1. 在 `portal/` 下創建新的套件資料夾
2. 在該資料夾中添加套件內容
3. 在 `docs/index.html` 中添加新的套件卡片
4. 更新本 README 文件

## 訪問入口

- **Portal 入口頁**: `https://keithsflau.github.io/primarychi/` (docs/index.html)
- **Language Monopoly**: `portal/language_monopoly/webapp/`

