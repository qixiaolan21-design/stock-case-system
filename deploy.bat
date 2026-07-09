@echo off
chcp 65001 >nul
echo ==========================================
echo  股票案例系统 - 部署到 Render
echo ==========================================
echo.

REM 检查是否安装了 render-cli
where render >nul 2>nul
if %errorlevel% neq 0 (
    echo [1/4] 安装 Render CLI...
    npm install -g @render/cli
) else (
    echo [1/4] Render CLI 已安装
)

echo.
echo [2/4] 登录 Render...
echo 请在浏览器中完成登录，然后回到这里按任意键继续
render login
pause >nul

echo.
echo [3/4] 部署服务...
cd /d "%~dp0"
render deploy --service stock-case-system

echo.
echo [4/4] 部署完成！
echo.
echo 访问地址: https://stock-case-system.onrender.com
echo.
pause
