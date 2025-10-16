@echo off
echo ================================
echo   SwasthAI Project Setup
echo ================================
echo.

echo [1/5] Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH!
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo [2/5] Installing pipenv...
pip install pipenv
if %errorlevel% neq 0 (
    echo ERROR: Failed to install pipenv!
    pause
    exit /b 1
)

echo [3/5] Installing project dependencies...
pipenv install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo [4/5] Setting up environment file...
if not exist .env (
    copy .env.example .env
    echo .env file created! Please edit it with your API keys.
) else (
    echo .env file already exists.
)

echo [5/5] Setup complete!
echo.
echo ================================
echo   NEXT STEPS:
echo ================================
echo 1. Edit .env file with your API keys
echo 2. Run: pipenv shell
echo 3. Run: python -m Gradio.voicebot
echo.
echo Happy Coding! 🚀
pause