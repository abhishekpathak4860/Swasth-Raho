# step1:setup audio recorder(ffmpeg & portaudio)
from dotenv import load_dotenv
load_dotenv()
import logging
import speech_recognition as sr
from pydub import AudioSegment
from io import BytesIO
import os

# Set ffmpeg path
os.environ["PATH"] += os.pathsep + r"C:\\Users\Asus\Downloads\\ffmpeg-2025-03-31-git-35c091f4b7-full_build\\ffmpeg\bin"

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def record_audio(file_path, timeout=20, phrase_time_limit=None):
    """
    Function to record audio from the microphone and save it as an MP3 file.
    """
    recognizer = sr.Recognizer()
    
    try:
        with sr.Microphone() as source:
            # logging.info("Adjusting for ambient noise...")
            recognizer.adjust_for_ambient_noise(source, duration=1)
            # logging.info("Start speaking now...")
            
            # Record the audio
            audio_data = recognizer.listen(source, timeout=timeout, phrase_time_limit=phrase_time_limit)
            # logging.info("Recording complete.")
            
            # Convert the recorded audio to an MP3 file
            wav_data = audio_data.get_wav_data()
            audio_segment = AudioSegment.from_wav(BytesIO(wav_data))
            audio_segment.export(file_path, format="mp3", bitrate="128k")
            
            # logging.info(f"Audio saved to {file_path}")

    except Exception as e:
        logging.error(f"An error occurred: {e}")

audio_filepath="patient_voice_test.mp3"
record_audio(file_path=audio_filepath)

# step 2:speech to text-STT-model for transcription
from groq import Groq

GROQ_API_KEY=os.environ.get("GROQ_API_KEY")
STT_model="whisper-large-v3"

def transcribe_with_groq(STT_model,audio_file,GROQ_API_KEY):
   client = Groq(api_key=GROQ_API_KEY)
 
   audio_file=open(audio_file,"rb")
   transcription=client.audio.transcriptions.create(
    model=STT_model,
    file=audio_file,
    language="en"
  )
   return transcription.text