# 🩺 SwasthAI - AI Medical Voice Assistant

## 📋 About This Project

This is an AI-powered medical voice assistant that:

- 🎤 Converts your voice to text
- 🖼️ Analyzes medical images
- 🤖 Provides medical advice like an AI doctor
- 🔊 Converts text back to voice

## 🎯 Key Features

- **Voice-to-Text**: Speech recognition using Groq Whisper API
- **Image Analysis**: Medical image analysis using computer vision
- **AI Doctor**: Intelligent responses using Meta Llama models
- **Text-to-Speech**: Voice output using Google Text-to-Speech
- **Web Interface**: User-friendly UI with Gradio framework

---

## 🚀 Project Setup Guide (For Beginners)

### Step 1: Python Installation

#### For Windows:

1. **Download Python**:

   - Go to https://python.org
   - Download **Python 3.12** or newer version
   - ⚠️ **Important**: During installation, check the "Add Python to PATH" checkbox ✅

2. **Verify Installation**:
   ```bash
   python --version
   # Output should be: Python 3.12.x
   ```

### Step 2: Project Setup

#### 2.1 Clone/Download Project

```bash
# If you have Git
git clone <your-repository-url>

# Or download ZIP file and extract it
```

#### 2.2 Navigate to Project Directory

```bash
cd SwasthAI
```

### Step 3: Virtual Environment Setup

#### 3.1 Install Pipenv (Recommended)

```bash
pip install pipenv
```

#### 3.2 Create and Activate Virtual Environment

```bash
# Install dependencies
pipenv install

# Activate virtual environment
pipenv shell
```

#### Alternative: Using venv

```bash
# Create virtual environment
python -m venv swasthai_env

# Activate it
# Windows:
swasthai_env\Scripts\activate
# Mac/Linux:
source swasthai_env/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Environment Variables Setup

#### 4.1 Create `.env` file

```bash
# Create .env file in project root
touch .env  # Mac/Linux
# For Windows, manually create .env file
```

#### 4.2 Add API Keys

Add this content to `.env` file:

```env
# Groq API Key (Required)
GROQ_API_KEY=your_groq_api_key_here

# Hugging Face API Key (Required)
HUGGINGFACE_API_KEY=your_huggingface_api_key_here

# Optional: ElevenLabs API Key (for premium voice)
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

#### 4.3 How to Get API Keys:

**Groq API Key:**

1. Go to https://console.groq.com
2. Create account/Login
3. Navigate to API Keys section and generate new key

**Hugging Face API Key:**

1. Create account at https://huggingface.co
2. Go to Settings > Access Tokens
3. Create new token

---

## 📦 Dependencies Information

### Core Libraries:

```python
# AI & ML Libraries
groq==0.4.1              # Speech-to-text API
gradio==4.44.0           # Web UI framework
huggingface_hub==0.19.4  # AI model access

# Audio Processing
gtts==2.3.2              # Google Text-to-Speech
pydub==0.25.1            # Audio manipulation
speechrecognition==3.10.0 # Speech recognition
pyaudio==0.2.11          # Audio I/O

# Utility Libraries
python-dotenv==1.0.0     # Environment variables
requests==2.31.0         # HTTP requests
Pillow==10.0.1           # Image processing
```

### System Requirements:

- **Python**: 3.8+ (Recommended: 3.12)
- **RAM**: Minimum 4GB (Recommended: 8GB+)
- **Storage**: 2GB free space
- **Internet**: Stable connection for API calls

---

## 🏃‍♂️ How to Run the Project

### Method 1: Direct Run (Recommended)

```bash
# Activate virtual environment
pipenv shell

# Run the project
python -m Gradio.voicebot
```

### Method 2: Alternative Run

```bash
# Run file directly
python Gradio/voicebot.py
```

### Success Indicators:

```bash
# You should see this output:
Running on local URL:  http://127.0.0.1:7860
Running on public URL: https://xxxxx.gradio.live

To create a public link, set `share=True` in `launch()`.
```

---

## 🗂️ Understanding Project Structure

```
SwasthAI/
│
├── 📁 Brain/                    # AI Logic
│   ├── __init__.py
│   ├── brain.py                 # Main AI functions
│   └── __pycache__/            # Python cache files
│
├── 📁 Doctor_Voice/             # Text-to-Speech
│   ├── __init__.py
│   ├── doctor_voice.py          # Voice generation
│   └── __pycache__/
│
├── 📁 Patient_Voice/            # Speech-to-Text
│   ├── __init__.py
│   ├── patient_voice.py         # Voice recognition
│   └── __pycache__/
│
├── 📁 Gradio/                   # Web Interface
│   ├── __init__.py
│   ├── voicebot.py             # Main application
│   └── __pycache__/
│
├── 📄 .env                      # Environment variables
├── 📄 Pipfile                   # Dependencies list
├── 📄 Pipfile.lock             # Locked dependencies
├── 📄 README.md                # This file
└── 🎵 *.mp3                    # Generated audio files
```

### File Functions:

1. **`brain.py`**: Image analysis and AI responses
2. **`doctor_voice.py`**: Converts text to audio
3. **`patient_voice.py`**: Converts audio to text
4. **`voicebot.py`**: Main web application and UI

---

## 🔧 Troubleshooting

### Common Issues:

#### 1. **ModuleNotFoundError**

```bash
# Solution:
pipenv install
# या
pip install -r requirements.txt
```

#### 2. **API Key Errors**

```bash
# Check .env file:
cat .env  # Mac/Linux
type .env  # Windows

# Ensure proper format:
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
```

#### 3. **Audio Permission Issues**

```bash
# Windows: Run as administrator
# Mac: Give microphone permission in System Preferences
# Linux: Install audio packages
sudo apt-get install portaudio19-dev python3-pyaudio
```

#### 4. **Port Already in Use**

```bash
# Change port in voicebot.py:
demo.launch(debug=True, server_port=7861)
```

#### 5. **Gradio Launch Issues**

```bash
# Clear gradio cache:
rm -rf .gradio/  # Mac/Linux
rmdir /s .gradio\  # Windows
```

---

## 🎮 How to Use

### Step 1: Start Application

```bash
python -m Gradio.voicebot
```

### Step 2: Open in Web Browser

- URL: `http://127.0.0.1:7860`
- Browser should open automatically

### Step 3: Use Features

1. **🎤 Microphone**:

   - Press record button
   - Speak your medical question
   - Stop recording

2. **🖼️ Image Upload** (Optional):

   - Upload medical image/photo
   - X-ray, skin condition, etc.

3. **💬 Ask Doctor**:

   - Click the button
   - AI will process
   - Get response text and audio

4. **🔄 Reset Chat**:
   - To clear conversation

---

## 🔒 Security & Privacy

### Data Privacy:

- **Voice data**: Processed on Groq servers
- **Images**: Analyzed on Hugging Face servers
- **Local storage**: Audio files generated locally
- **No permanent storage**: Data is not stored permanently

### API Security:

- Keep API keys in `.env` file
- Never commit `.env` to Git
- Rotate API keys regularly

---

## 🚀 Advanced Configuration

### Custom Model Selection:

```python
# Change model in brain.py:
model="meta-llama/llama-4-maverick-17b-128e-instruct"

# Available models:
- "meta-llama/llama-3-8b-instruct"
- "mistralai/mixtral-8x7b-instruct"
- "google/gemma-7b-it"
```

### Voice Customization:

```python
# Voice settings in doctor_voice.py:
language = "hi"  # For Hindi
slow = True      # For slow speech
```

### UI Customization:

```python
# Change theme in voicebot.py:
demo.launch(
    debug=True,
    theme="dark",
    server_name="0.0.0.0",  # External access
    share=True              # Public URL
)
```

---

## 🤝 Contributing

### Development Setup:

```bash
# Install development dependencies
pipenv install --dev

# Code formatting
black *.py

# Linting
flake8 *.py
```

### Git Workflow:

```bash
# Create new feature branch
git checkout -b feature/new-feature

# Commit changes
git add .
git commit -m "Add new feature"

# Push
git push origin feature/new-feature
```

---

## 📞 Support & Contact

### Report Issues:

1. Go to GitHub Issues section
2. Provide detailed error description
3. Explain steps to reproduce
4. Share system information

### Development Help:

- 📧 Email: your-email@domain.com
- 💬 Discord: Your-Discord-Server
- 📱 WhatsApp: +91-XXXXXXXXXX

---

## 📜 License

```
MIT License

Copyright (c) 2024 SwasthAI Project

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software")...
```

---

## 🙏 Acknowledgments

### Technologies Used:

- **Groq**: Fast AI inference
- **Hugging Face**: Open-source AI models
- **Gradio**: Interactive web interfaces
- **Google TTS**: Text-to-speech conversion

### Inspiration:

This project was created to improve healthcare accessibility, especially in rural areas where doctor availability is limited.

---

## 🔄 Version History

### v1.0.0 (Current)

- ✅ Basic voice interaction
- ✅ Image analysis capability
- ✅ Web-based interface
- ✅ Multiple language support

### Future Roadmap:

- 🔲 Mobile app development
- 🔲 Offline mode capability
- 🔲 Multi-language voice support
- 🔲 Doctor appointment booking
- 🔲 Medical report generation

---

_Happy Coding! 🚀 Hope your first Python project is successful!_
