@echo off
chcp 65001 >nul
echo ==========================================
echo   股票教学案例管理系统 - 快速部署工具
echo ==========================================
echo.

:: 检查 git
where git >nul 2>nul
if errorlevel 1 (
    echo [错误] 未找到 Git，请先安装 Git
    pause
    exit /b 1
)

echo [1/4] 正在初始化 Git 仓库...
cd /d "%~dp0"
git init

echo [2/4] 正在添加文件...
git add .

echo [3/4] 正在提交...
git commit -m "Initial commit" 2>nul || echo 已提交过，跳过

echo.
echo ==========================================
echo   部署步骤：
echo ==========================================
echo.
echo 1. 访问 https://github.com/new 创建仓库
echo    仓库名：stock-case-system
echo.
echo 2. 创建后，运行以下命令推送代码：
echo.
echo    git remote add origin https://github.com/你的用户名/stock-case-system.git
set /p username="请输入你的 GitHub 用户名: "
echo.
echo    git remote add origin https://github.com/%username%/stock-case-system.git
git remote remove origin 2>nul
git remote add origin https://github.com/%username%/stock-case-system.git

echo [4/4] 正在推送到 GitHub...
git branch -M main
git push -u origin main

echo.
echo ==========================================
echo   下一步：部署到 Render
echo ==========================================
echo.
echo 1. 访问 https://dashboard.render.com
echo 2. 点击 New + ^> Web Service
echo 3. 选择 GitHub 仓库 stock-case-system
echo 4. 点击 Create Web Service
echo.
echo 部署完成后会获得网址，可以分享给其他人！
echo.
pause
