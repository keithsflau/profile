# 鏈接檢查和 GitHub 上傳指南

## 📤 上傳到 GitHub

### ✅ 方法 1：使用批處理文件（推薦 - 最簡單）

**直接雙擊運行：**
```
upload_to_github.bat
```

這會自動：
1. 添加所有更改的文件
2. 提交更改（包含提交訊息）
3. 推送到 GitHub

### 方法 2：手動執行 Git 命令

打開命令提示符（CMD）或 PowerShell，在項目根目錄執行：

```bash
# 1. 添加所有更改
git add -A

# 2. 提交更改
git commit -m "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"

# 3. 推送到 GitHub
git push origin main
```

## 🔍 檢查死鏈接

### ✅ 方法 1：使用批處理文件（推薦）

**直接雙擊運行：**
```
check_broken_links.bat
```

這會運行簡化版檢查腳本，**無需安裝額外依賴**，只檢查：
- ✅ 本地文件是否存在
- ✅ 內部錨點（#anchor）是否有效

### 方法 2：手動執行 Python 腳本

```bash
# 簡化版（推薦，無需額外依賴）
python check_links_simple.py

# 完整版（需要安裝 requests 庫）
pip install requests
python check_links.py
```

## 檢查腳本功能

`check_links.py` 會檢查：
- ✅ 內部文件鏈接（相對路徑）
- ✅ 內部錨點鏈接（#anchor）
- ✅ 外部鏈接（HTTP/HTTPS）
- ✅ 文件是否存在
- ✅ 錨點 ID 是否存在

## 注意事項

1. **外部鏈接檢查**：腳本會抽樣檢查前 10 個外部鏈接（如 CDN 鏈接），因為檢查所有外部鏈接可能很耗時。

2. **動態生成的錨點**：如果 HTML 中有 JavaScript 動態生成的 ID，可能會被標記為死鏈接，但實際運行時可能正常。

3. **GitHub Pages**：如果使用 GitHub Pages 部署，請確保：
   - 所有路徑使用相對路徑
   - 文件名大小寫正確
   - 沒有特殊字符

## 常見問題

### Q: Git 推送失敗怎麼辦？
A: 檢查：
- 是否已配置 git 用戶名和郵箱
- 是否有推送權限
- 網絡連接是否正常

### Q: 檢查腳本報告太多死鏈接？
A: 
- 檢查是否為動態生成的鏈接
- 檢查文件路徑是否正確
- 檢查錨點 ID 是否與鏈接匹配

