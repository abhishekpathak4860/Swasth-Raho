#!/bin/bash

echo "================================"
echo "   SwasthAI Project Setup"
echo "================================"
echo

echo "[1/5] Checking Python installation..."
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python3 is not installed!"
    echo "Please install Python3 from https://python.org"
    exit 1
fi

python3 --version

echo "[2/5] Installing pipenv..."
pip3 install pipenv
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install pipenv!"
    exit 1
fi

echo "[3/5] Installing project dependencies..."
pipenv install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo "[4/5] Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo ".env file created! Please edit it with your API keys."
else
    echo ".env file already exists."
fi

echo "[5/5] Setup complete!"
echo
echo "================================"
echo "   NEXT STEPS:"
echo "================================"
echo "1. Edit .env file with your API keys"
echo "2. Run: pipenv shell"
echo "3. Run: python -m Gradio.voicebot"
echo
echo "Happy Coding! 🚀"