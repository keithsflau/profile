# GitHub Pages 部署指南

## 解決 404 錯誤的步驟

### 1. 確保檔案已推送到 GitHub

```bash
cd profile
git init
git add .
git commit -m "Initial commit: Add web portal"
git branch -M main
git remote add origin https://github.com/keithsflau/profile.git
git push -u origin main
```

### 2. 啟用 GitHub Pages

1. 前往 GitHub 倉庫：`https://github.com/keithsflau/profile`
2. 點擊 **Settings** (設置)
3. 在左側選單找到 **Pages** (頁面)
4. 在 **Source** (來源) 下選擇：
   - Branch: `main`
   - Folder: `/ (root)` 或 `/docs` (如果檔案在 docs 資料夾)
5. 點擊 **Save** (儲存)

### 3. 等待部署

- GitHub Pages 通常會在幾分鐘內部署完成
- 您可以在 **Settings > Pages** 頁面看到部署狀態
- 部署完成後，網址會是：`https://keithsflau.github.io/profile/`

### 4. 重要檔案說明

- `.nojekyll` - 告訴 GitHub Pages 不要使用 Jekyll 處理檔案（已添加）
- `index.html` - 主入口頁面（必須在根目錄或選定的資料夾）
- `styles.css` - 樣式檔案

## 驗證部署

部署成功後，訪問 `https://keithsflau.github.io/profile/` 應該會看到：
- 紫色的漸層背景
- 三個專案卡片（Profile, PrimaryChi, SecondarySci）

## 故障排除

如果仍然看到 404：
1. 確認檔案已經推送到 GitHub
2. 確認選擇了正確的 branch 和 folder
3. 等待 5-10 分鐘讓 GitHub 處理
4. 檢查 Settings > Pages 是否有錯誤訊息
5. 嘗試清除瀏覽器快取或使用無痕模式
