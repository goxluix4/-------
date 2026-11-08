@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ============================================
echo  設定「空中滑鼠」開機自動在背景執行
echo ============================================

where py >nul 2>nul
if %errorlevel%==0 (set PY=py -3) else (set PY=python)

if not exist ".venv\Scripts\pythonw.exe" (
    echo [1/3] 建立虛擬環境...
    %PY% -m venv .venv
    if errorlevel 1 (
        echo 找不到 Python，請先安裝 Python 3.9 以上，並勾選 "Add python.exe to PATH"
        pause
        exit /b 1
    )
)

echo [2/3] 安裝 / 檢查套件...
".venv\Scripts\python.exe" -m pip install --disable-pip-version-check -q -r requirements.txt
if errorlevel 1 (
    echo 套件安裝失敗，請檢查網路連線。
    pause
    exit /b 1
)

echo [3/3] 建立開機啟動捷徑...
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$d = (Resolve-Path '.').Path;" ^
  "$s = (New-Object -ComObject WScript.Shell).CreateShortcut([Environment]::GetFolderPath('Startup') + '\AirMouse.lnk');" ^
  "$s.TargetPath = Join-Path $d '.venv\Scripts\pythonw.exe';" ^
  "$s.Arguments = '\"' + (Join-Path $d 'server.py') + '\"';" ^
  "$s.WorkingDirectory = $d;" ^
  "$s.IconLocation = (Join-Path $d '.venv\Scripts\pythonw.exe') + ',0';" ^
  "$s.Save()"
if errorlevel 1 (
    echo 建立捷徑失敗。
    pause
    exit /b 1
)

rem 先關掉舊的背景執行，再立刻啟動一次（不用等重開機）
powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \"Name='pythonw.exe'\" | Where-Object { $_.CommandLine -like '*server.py*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }" >nul 2>nul
start "" ".venv\Scripts\pythonw.exe" "%~dp0server.py"
timeout /t 4 /nobreak >nul

echo.
echo ✅ 完成！以後開機就會自動在背景執行（看不到視窗是正常的）。
echo.
if exist "目前網址.txt" type "目前網址.txt"
echo.
echo 第一次請用手機開上面的網址，接受憑證警告後，把網頁「加到主畫面」。
echo 想取消自動啟動，請執行「取消開機自動啟動.bat」。
pause
