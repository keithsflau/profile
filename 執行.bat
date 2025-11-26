@echo off
chcp 65001 >nul 2>&1
title 上傳到 GitHub 並檢查鏈接

cd /d "%~dp0"

echo.
echo ================================================
echo   上傳到 GitHub 並檢查鏈接
echo ================================================
echo.

echo [1/4] 檢查 git 狀態...
git status --short
echo.

echo [2/4] 添加所有更改...
git add -A
if errorlevel 1 (
    echo [X] 錯誤：添加文件失敗
    pause
    exit /b 1
)
echo [OK] 文件已添加
echo.

echo [3/4] 提交更改...
git commit -m "更新所有 footer 為包含聖經經文的格式 (Jeremiah 10:12)"
if errorlevel 1 (
    echo [!] 提交失敗或沒有更改需要提交
) else (
    echo [OK] 更改已提交
)
echo.

echo [4/4] 推送到 GitHub...
git push origin main
if errorlevel 1 (
    echo [!] 推送失敗，可能的原因：
    echo     - 沒有更改需要推送
    echo     - 網絡連接問題
    echo     - 權限問題
) else (
    echo [OK] 已推送到 GitHub
)
echo.

echo ================================================
echo   檢查死鏈接
echo ================================================
echo.

if exist check_links_simple.py (
    python check_links_simple.py
) else (
    echo [X] 鏈接檢查腳本不存在
)

echo.
echo ================================================
echo   完成！
echo ================================================
echo.
pause

