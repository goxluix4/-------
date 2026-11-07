@echo off
chcp 65001 >nul
cd /d "%~dp0"

where py >nul 2>nul
if %errorlevel%==0 (set PY=py -3) else (set PY=python)

if not exist ".venv\Scripts\python.exe" (
    echo [1/2] 建立虛擬環境...
    %PY% -m venv .venv
    if errorlevel 1 (
        echo 找不到 Python，請先到 https://www.python.org/downloads/ 安裝 Python 3.9 以上，安裝時勾選 "Add python.exe to PATH"
        pause
        exit /b 1
    )
)

echo [2/2] 安裝 / 檢查套件...
".venv\Scripts\python.exe" -m pip install --disable-pip-version-check -q -r requirements.txt
if errorlevel 1 (
    echo 套件安裝失敗，請檢查網路連線。
    pause
    exit /b 1
)

".venv\Scripts\python.exe" server.py %*
pause
