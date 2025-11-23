# GitHub Pages 設置指南

## 📋 步驟 1: 初始化 Git 倉庫（如果還沒有）

```bash
# 在項目根目錄執行
git init
git add .
git commit -m "Add portfolio entry page"
```

## 📋 步驟 2: 連接到 GitHub 倉庫

```bash
# 如果還沒有創建 GitHub 倉庫，先在 GitHub 上創建一個
# 然後執行以下命令（替換 YOUR_USERNAME 和 YOUR_REPO_NAME）

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 📋 步驟 3: 設置 GitHub Pages

1. 前往你的 GitHub 倉庫頁面
2. 點擊 **Settings** (設置)
3. 在左側菜單中找到 **Pages**
4. 在 **Source** 部分：
   - 選擇 **Branch**: `main`
   - 選擇 **Folder**: `/profile`
5. 點擊 **Save** (保存)
6. 等待幾分鐘，GitHub 會生成你的頁面
7. 你的頁面將在以下地址可用：
   - `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## 📋 步驟 4: 測試頁面

### 本地測試

```bash
# 在 profile 目錄中
cd profile
python -m http.server 8000
# 或使用 Node.js
npx serve .
```

然後在瀏覽器中訪問 `http://localhost:8000`

### 在線測試

1. 等待 GitHub Pages 部署完成（通常需要 1-2 分鐘）
2. 訪問你的 GitHub Pages URL
3. 點擊各個應用程式鏈接，確保都能正常訪問

## 🔧 故障排除

### 問題 1: 鏈接無法打開

**解決方案**: 檢查相對路徑是否正確。如果 GitHub Pages 是從 `/profile` 目錄提供服務，路徑 `../` 是正確的。

### 問題 2: Language Monopoly 無法打開

**解決方案**: 確保已經構建了項目：
```bash
cd Pri-Chi/portal/language_monopoly/webapp
npm install
npm run build
git add Pri-Chi/portal/language_monopoly/webapp/dist
git commit -m "Build Language Monopoly"
git push
```

### 問題 3: 頁面顯示 404

**解決方案**: 
- 確保 GitHub Pages 設置正確
- 確保 `index.html` 在 `profile` 目錄中
- 等待幾分鐘讓 GitHub 完成部署

## 📝 更新內容

當你更新了任何應用程式後：

```bash
git add .
git commit -m "Update web apps"
git push
```

GitHub Pages 會自動更新（可能需要幾分鐘）。

