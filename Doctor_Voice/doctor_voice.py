# step1a:setup text to speech model with gTTS
from dotenv import load_dotenv
load_dotenv()
import os
from gtts import gTTS
# Removed playsound import as it's causing issues

#Step2: Use Model for Text output to Voice
from pydub import AudioSegment
import subprocess
import platform

#Required only on Windows, because .mp3 doesn’t play directly in Windows PowerShell audio player.
def convert_mp3_to_wav(mp3_path, wav_path):
    sound = AudioSegment.from_mp3(mp3_path)
    sound.export(wav_path, format="wav")


# def text_to_speech_with_gtts(input_text, output_filepath):
#     language="en"
#     audioobj= gTTS(
#         text=input_text,
#         lang=language,
#         slow=False
#     )
#     audioobj.save(output_filepath)
#     os_name = platform.system()
#     try:
#         if os_name == "Darwin":  # macOS
#             subprocess.run(['afplay', output_filepath])
#         elif os_name == "Windows":  # Windows
#               # Convert to WAV for Windows Media.SoundPlayer
#             wav_path = output_filepath.replace(".mp3", ".wav")
#             convert_mp3_to_wav(output_filepath, wav_path)
#             subprocess.run(['powershell', '-c', f'(New-Object Media.SoundPlayer "{wav_path}").PlaySync();'])
#             os.remove(wav_path)  # <-- Delete the WAV file after playing

#         elif os_name == "Linux":  # Linux
#             subprocess.run(['aplay', output_filepath])  # Alternative: use 'mpg123' or 'ffplay'
#         else:
#             raise OSError("Unsupported operating system")
#     except Exception as e:
#         print(f"An error occurred while trying to play the audio: {e}")

def text_to_speech_with_gtts(input_text, output_filepath):
    language = "en"
    
    # Remove existing file if it exists to avoid permission errors
    try:
        if os.path.exists(output_filepath):
            os.remove(output_filepath)
    except Exception as e:
        print(f"Warning: Could not remove existing file {output_filepath}: {e}")
    
    # Try multiple attempts to create the audio file
    max_attempts = 3
    for attempt in range(max_attempts):
        try:
            # Create new audio file
            audioobj = gTTS(text=input_text, lang=language, slow=False)
            audioobj.save(output_filepath)
            
            # Verify the file was created successfully
            if os.path.exists(output_filepath) and os.path.getsize(output_filepath) > 0:
                return output_filepath
            else:
                raise Exception(f"File {output_filepath} was not created properly")
                
        except Exception as e:
            print(f"Attempt {attempt + 1} failed to create audio file: {e}")
            if attempt < max_attempts - 1:
                # Try with a different filename
                base_name = output_filepath.replace('.mp3', '')
                output_filepath = f"{base_name}_retry_{attempt}.mp3"
            else:
                raise e
    
    return output_filepath  