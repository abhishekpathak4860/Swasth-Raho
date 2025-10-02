# python -m Gradio.voicebot.py
from dotenv import load_dotenv
load_dotenv()
import os
import sys
import gradio as gr
import time
import platform
import subprocess

# Ensure folder exists
AUDIO_DIR = "doctor_response"
if not os.path.exists(AUDIO_DIR):
    os.makedirs(AUDIO_DIR)
# Add the parent directory to Python path for imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

try:
    from Brain.brain import encode_image, analyze_image_with_query
    from Patient_Voice.patient_voice import transcribe_with_groq
    from Doctor_Voice.doctor_voice import text_to_speech_with_gtts
except ImportError:
    parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.insert(0, parent_dir)
    from Brain.brain import encode_image, analyze_image_with_query
    from Patient_Voice.patient_voice import transcribe_with_groq
    from Doctor_Voice.doctor_voice import text_to_speech_with_gtts

# ---------------------- Global Variables ----------------------
chat_history = []
encoded_image = None

system_prompt = """You are a professional general physician named Dr. Meera Sharma.
Answer in short, natural, friendly tones like you're speaking to a real patient.
Do not start with 'I see in the image'. Say 'Hi Abhishek...' instead.
Keep answers brief (max 2 sentences). For follow-up questions, continue from the last topic.
No special characters, no markdown."""

# ---------------------- Helper Functions ----------------------
def format_chat_history(history):
    return "\n\n".join([f"👤 You: {user}\n👨‍⚕️ Doctor: {bot}" for user, bot in history])

def cleanup_audio_files():
    try:
        for filename in os.listdir(AUDIO_DIR):
            if filename.endswith(".mp3"):
                try:
                    os.remove(os.path.join(AUDIO_DIR, filename))
                except Exception as e:
                    print(f"Could not remove {filename}: {e}")
    except Exception as e:
        print(f"Error during cleanup: {e}")


def reset_history():
    global chat_history, encoded_image
    chat_history = []
    encoded_image = None
    cleanup_audio_files()
    return "", "", None, ""

def play_audio_local(filepath):
    os_name = platform.system()
    try:
        if os_name == "Darwin":
            subprocess.run(['afplay', filepath])
        elif os_name == "Windows":
            subprocess.run(['powershell', '-c', f'(New-Object Media.SoundPlayer "{filepath}").PlaySync();'])
        elif os_name == "Linux":
            subprocess.run(['aplay', filepath])
    except Exception as e:
        print(f"Error playing audio locally: {e}")

# ---------------------- Main Function ----------------------
def process_inputs(audio_filepath, image_filepath):
    global chat_history, encoded_image

    try:
        if not audio_filepath or not os.path.exists(audio_filepath):
            return "❌ No audio file provided or file not found", "Please record your voice first", None, format_chat_history(chat_history)

        # Step 1: Transcribe audio
        speech_to_text_output = transcribe_with_groq(
            STT_model="whisper-large-v3",
            audio_file=audio_filepath,
            GROQ_API_KEY=os.environ.get("GROQ_API_KEY")
        )

    except Exception as e:
        return f"❌ Transcription Error: {str(e)}", "Sorry, there was an error processing your voice", None, format_chat_history(chat_history)

    try:
        # Step 2: Encode image once
        if image_filepath and encoded_image is None and not chat_history:
            encoded_image = encode_image(image_filepath)

        # Step 3: Build prompt
        if not chat_history:
            full_prompt = f"{system_prompt}\nUser: {speech_to_text_output}\nDoctor:"
        else:
            last_user, last_bot = chat_history[-1]
            full_prompt = (
                f"Previous conversation:\nUser: {last_user}\nDoctor: {last_bot}\n\n"
                f"Now the user is asking: {speech_to_text_output}\n"
                f"As a doctor, continue from your last advice. Keep it short and relevant."
            )

        # Step 4: Get doctor response
        doctor_response = analyze_image_with_query(
            query=full_prompt,
            encoded_image=encoded_image,
            model="meta-llama/llama-4-maverick-17b-128e-instruct"
        )

        chat_history.append((speech_to_text_output, doctor_response))

        # Step 5: Save doctor response audio
        timestamp = int(time.time() * 1000)
        audio_filename = f"doctor_response_{timestamp}.mp3"
        audio_filepath = os.path.join(AUDIO_DIR, audio_filename)
        text_to_speech_with_gtts(input_text=doctor_response, output_filepath=audio_filepath)

        # Optional: play locally on your machine
        # play_audio_local(audio_filename)

        return speech_to_text_output, doctor_response,audio_filepath, format_chat_history(chat_history)

    except Exception as e:
        return f"❌ Processing Error: {str(e)}", "Sorry, there was an error processing your request", None, format_chat_history(chat_history)

# ---------------------- Gradio UI ----------------------
with gr.Blocks() as demo:
    gr.HTML("""
    <div style="display: flex; align-items: center;">
        <img src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png" alt="Logo" style="height: 70px; margin-right: 10px;">
        <span style="font-size: 40px; font-weight: 900; color: #002b26;">स्वस्थ रहो</span>
    </div>
    """)

    gr.Markdown("## 🩺 Dr. Meera Sharma with Vision and Voice")

    with gr.Row():
        audio_input = gr.Audio(sources=["microphone"], type="filepath", label="🎙️ Speak Your Medical Query")
        image_input = gr.Image(type="filepath", label="🖼️ Upload Medical Image (optional)")

    with gr.Row():
        submit_btn = gr.Button("💬 Ask Doctor")
        reset_btn = gr.Button("🔄 Reset Chat")

    stt_output = gr.Textbox(label="📝 Transcribed Text")
    doc_response = gr.Textbox(label="💡 Doctor's Response")
    doc_voice = gr.Audio(label="🔊 Doctor's Voice", type="filepath", autoplay=True, interactive=False, show_download_button=False)
    chat_output = gr.Textbox(label="📜 Chat History", lines=10, interactive=False)

    # Bind buttons
    submit_btn.click(
        fn=process_inputs,
        inputs=[audio_input, image_input],
        outputs=[stt_output, doc_response, doc_voice, chat_output]
    )

    reset_btn.click(
        fn=reset_history,
        inputs=[],
        outputs=[stt_output, doc_response, doc_voice, chat_output]
    )

demo.launch(debug=True)
