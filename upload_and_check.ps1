# PowerShell 腳本：上傳到 GitHub 並檢查鏈接
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "上傳到 GitHub 並檢查鏈接" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 切換到腳本所在目錄
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# 步驟 1: 檢查 git 狀態
Write-Host "步驟 1: 檢查 git 狀態..." -ForegroundColor Yellow
git status --short
Write-Host ""

# 步驟 2: 添加所有文件
Write-Host "步驟 2: 添加所有更改..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：添加文件失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 文件已添加" -ForegroundColor Green
Write-Host ""

# 步驟 3: 提交
Write-Host "步驟 3: 提交更改..." -ForegroundColor Yellow
$commitMessage = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：提交失敗（可能沒有更改需要提交）" -ForegroundColor Yellow
} else {
    Write-Host "✓ 更改已提交" -ForegroundColor Green
}
Write-Host ""

# 步驟 4: 推送到 GitHub
Write-Host "步驟 4: 推送到 GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "警告：推送失敗，請檢查網絡連接和權限" -ForegroundColor Yellow
} else {
    Write-Host "✓ 已推送到 GitHub" -ForegroundColor Green
}
Write-Host ""

# 步驟 5: 檢查鏈接
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "檢查死鏈接..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "check_links_simple.py") {
    python check_links_simple.py
} else {
    Write-Host "鏈接檢查腳本不存在" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "完成！" -ForegroundColor Green
Write-Host "按任意鍵退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "上傳到 GitHub 並檢查鏈接" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 切換到腳本所在目錄
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# 步驟 1: 檢查 git 狀態
Write-Host "步驟 1: 檢查 git 狀態..." -ForegroundColor Yellow
git status --short
Write-Host ""

# 步驟 2: 添加所有文件
Write-Host "步驟 2: 添加所有更改..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：添加文件失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 文件已添加" -ForegroundColor Green
Write-Host ""

# 步驟 3: 提交
Write-Host "步驟 3: 提交更改..." -ForegroundColor Yellow
$commitMessage = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：提交失敗（可能沒有更改需要提交）" -ForegroundColor Yellow
} else {
    Write-Host "✓ 更改已提交" -ForegroundColor Green
}
Write-Host ""

# 步驟 4: 推送到 GitHub
Write-Host "步驟 4: 推送到 GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "警告：推送失敗，請檢查網絡連接和權限" -ForegroundColor Yellow
} else {
    Write-Host "✓ 已推送到 GitHub" -ForegroundColor Green
}
Write-Host ""

# 步驟 5: 檢查鏈接
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "檢查死鏈接..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "check_links_simple.py") {
    python check_links_simple.py
} else {
    Write-Host "鏈接檢查腳本不存在" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "完成！" -ForegroundColor Green
Write-Host "按任意鍵退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "上傳到 GitHub 並檢查鏈接" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 切換到腳本所在目錄
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# 步驟 1: 檢查 git 狀態
Write-Host "步驟 1: 檢查 git 狀態..." -ForegroundColor Yellow
git status --short
Write-Host ""

# 步驟 2: 添加所有文件
Write-Host "步驟 2: 添加所有更改..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：添加文件失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 文件已添加" -ForegroundColor Green
Write-Host ""

# 步驟 3: 提交
Write-Host "步驟 3: 提交更改..." -ForegroundColor Yellow
$commitMessage = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：提交失敗（可能沒有更改需要提交）" -ForegroundColor Yellow
} else {
    Write-Host "✓ 更改已提交" -ForegroundColor Green
}
Write-Host ""

# 步驟 4: 推送到 GitHub
Write-Host "步驟 4: 推送到 GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "警告：推送失敗，請檢查網絡連接和權限" -ForegroundColor Yellow
} else {
    Write-Host "✓ 已推送到 GitHub" -ForegroundColor Green
}
Write-Host ""

# 步驟 5: 檢查鏈接
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "檢查死鏈接..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "check_links_simple.py") {
    python check_links_simple.py
} else {
    Write-Host "鏈接檢查腳本不存在" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "完成！" -ForegroundColor Green
Write-Host "按任意鍵退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "上傳到 GitHub 並檢查鏈接" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 切換到腳本所在目錄
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# 步驟 1: 檢查 git 狀態
Write-Host "步驟 1: 檢查 git 狀態..." -ForegroundColor Yellow
git status --short
Write-Host ""

# 步驟 2: 添加所有文件
Write-Host "步驟 2: 添加所有更改..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：添加文件失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 文件已添加" -ForegroundColor Green
Write-Host ""

# 步驟 3: 提交
Write-Host "步驟 3: 提交更改..." -ForegroundColor Yellow
$commitMessage = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：提交失敗（可能沒有更改需要提交）" -ForegroundColor Yellow
} else {
    Write-Host "✓ 更改已提交" -ForegroundColor Green
}
Write-Host ""

# 步驟 4: 推送到 GitHub
Write-Host "步驟 4: 推送到 GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "警告：推送失敗，請檢查網絡連接和權限" -ForegroundColor Yellow
} else {
    Write-Host "✓ 已推送到 GitHub" -ForegroundColor Green
}
Write-Host ""

# 步驟 5: 檢查鏈接
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "檢查死鏈接..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "check_links_simple.py") {
    python check_links_simple.py
} else {
    Write-Host "鏈接檢查腳本不存在" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "完成！" -ForegroundColor Green
Write-Host "按任意鍵退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "上傳到 GitHub 並檢查鏈接" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# 切換到腳本所在目錄
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# 步驟 1: 檢查 git 狀態
Write-Host "步驟 1: 檢查 git 狀態..." -ForegroundColor Yellow
git status --short
Write-Host ""

# 步驟 2: 添加所有文件
Write-Host "步驟 2: 添加所有更改..." -ForegroundColor Yellow
git add -A
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：添加文件失敗" -ForegroundColor Red
    exit 1
}
Write-Host "✓ 文件已添加" -ForegroundColor Green
Write-Host ""

# 步驟 3: 提交
Write-Host "步驟 3: 提交更改..." -ForegroundColor Yellow
$commitMessage = "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
git commit -m $commitMessage
if ($LASTEXITCODE -ne 0) {
    Write-Host "錯誤：提交失敗（可能沒有更改需要提交）" -ForegroundColor Yellow
} else {
    Write-Host "✓ 更改已提交" -ForegroundColor Green
}
Write-Host ""

# 步驟 4: 推送到 GitHub
Write-Host "步驟 4: 推送到 GitHub..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "警告：推送失敗，請檢查網絡連接和權限" -ForegroundColor Yellow
} else {
    Write-Host "✓ 已推送到 GitHub" -ForegroundColor Green
}
Write-Host ""

# 步驟 5: 檢查鏈接
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "檢查死鏈接..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path "check_links_simple.py") {
    python check_links_simple.py
} else {
    Write-Host "鏈接檢查腳本不存在" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "完成！" -ForegroundColor Green
Write-Host "按任意鍵退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


