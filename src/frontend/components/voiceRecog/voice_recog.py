import vosk
import pyaudio
import json
import sys
import os
import time
import datetime

def log_with_timestamp(msg):
    print(f"[{datetime.datetime.now().isoformat()}] {msg}")
    sys.stdout.flush()

print("[DEBUG] Starting voice recognition script")
log_with_timestamp("[DEBUG] Starting voice recognition script")

# Initialize Vosk model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "vosk-model-small-en-us-0.15")
log_with_timestamp(f"[DEBUG] Loading Vosk model from: {model_path}")
log_with_timestamp(f"[DEBUG] Model directory exists: {os.path.exists(model_path)}")
log_with_timestamp(f"[DEBUG] Model directory contents: {os.listdir(model_path)}")

start_time = time.time()
log_with_timestamp("[DEBUG] Starting model initialization...")
model = vosk.Model(model_path)
log_with_timestamp(f"[DEBUG] Model initialization took {time.time() - start_time:.2f} seconds")

log_with_timestamp("[DEBUG] Creating KaldiRecognizer...")
rec = vosk.KaldiRecognizer(model, 16000)
log_with_timestamp("[DEBUG] KaldiRecognizer created successfully")

def process_command(text):
    """Process the recognized text and extract commands directly"""
    print(f"[DEBUG] Processing command: {text}")
    text = text.lower().strip()
    command = text  # No prefix required
    print(f"[DEBUG] Extracted command: {command}")

    # Command mapping
    if "open notes" in command or "open notepad" in command:
        print("COMMAND:OPEN_NOTEPAD")
    elif "close notes" in command or "close notepad" in command:
        print("COMMAND:CLOSE_NOTEPAD")
    elif "open pcb" in command or "open process control block" in command or "open busy bee" in command:
        print("COMMAND:OPEN_PCB")
        sys.stdout.flush()  # Extra flush for PCB commands
    elif "close pcb" in command or "close process control block" in command or "close busy bee" in command:
        print("COMMAND:CLOSE_PCB")
        sys.stdout.flush()  # Extra flush for PCB commands
    elif "open replacement" in command or "open page replacement" in command or "open memory simulator" in command:
        print("COMMAND:OPEN_REPLACEMENT")
        sys.stdout.flush()  # Extra flush for replacement commands
    elif "close replacement" in command or "close page replacement" in command or "close memory simulator" in command:
        print("COMMAND:CLOSE_REPLACEMENT")
        sys.stdout.flush()  # Extra flush for replacement commands
    elif "open camera" in command or "start camera" in command:
        print("COMMAND:OPEN_CAMERA")
        sys.stdout.flush()
    elif "close camera" in command or "stop camera" in command:
        print("COMMAND:CLOSE_CAMERA")
        sys.stdout.flush()
    elif "capture" in command or "take photo" in command or "take picture" in command:
        print("COMMAND:CAPTURE_PHOTO")
        sys.stdout.flush()
    elif "shut down" in command:
        print("COMMAND:SHUTDOWN")
        return False

    sys.stdout.flush()  # Ensure the command is sent immediately
    return True

def record_transcript_vosk():
    """Record and process voice input using Vosk"""
    log_with_timestamp("[DEBUG] Initializing PyAudio...")
    p = pyaudio.PyAudio()
    log_with_timestamp("[DEBUG] Opening audio stream...")
    stream = p.open(format=pyaudio.paInt16,
                    channels=1,
                    rate=16000,
                    input=True,
                    frames_per_buffer=8192)
    log_with_timestamp("[DEBUG] Audio stream opened successfully")

    print("SYSTEM:READY")
    log_with_timestamp("[DEBUG] Listening for voice input...")
    sys.stdout.flush()

    try:
        log_with_timestamp("[DEBUG] Starting main recognition loop")
        while True:
            data = stream.read(4096, exception_on_overflow=False)
            # Get partial results
            if rec.AcceptWaveform(data):
                result = json.loads(rec.Result())
                recognized_text = result.get('text', '').strip()
                if recognized_text:
                    log_with_timestamp(f"[HEARD] Full recognition: {recognized_text}")
                    print(f"TRANSCRIPT:{recognized_text}")
                    sys.stdout.flush()
                    
                    if not process_command(recognized_text):
                        break
            else:
                # Print partial results
                partial = json.loads(rec.PartialResult())
                partial_text = partial.get('partial', '').strip()
                if partial_text:
                    log_with_timestamp(f"[HEARD] Partial: {partial_text}")
                    sys.stdout.flush()

    except KeyboardInterrupt:
        log_with_timestamp("[DEBUG] Received keyboard interrupt")
        print("SYSTEM:INTERRUPTED")
    except Exception as e:
        log_with_timestamp(f"[DEBUG] Exception occurred: {str(e)}")
        print(f"ERROR:{str(e)}")
    finally:
        log_with_timestamp("[DEBUG] Cleaning up resources")
        stream.stop_stream()
        stream.close()
        p.terminate()
        print("SYSTEM:STOPPED")
        sys.stdout.flush()

if __name__ == "__main__":
    print("[DEBUG] Starting voice recognition")
    record_transcript_vosk()

# --------------

# import vosk
# import pyaudio
# import json
# import speech_recognition as sr

# # Initialize Vosk model
# model_path = "src/frontend/components/voicerecog/vosk-model-small-en-us-0.15"
# model = vosk.Model(model_path)
# rec = vosk.KaldiRecognizer(model, 16000)

# # Initialize SpeechRecognition recognizer
# recognizer = sr.Recognizer()

# def record_transcript_vosk():
#     p = pyaudio.PyAudio()
#     stream = p.open(format=pyaudio.paInt16,
#                     channels=1,
#                     rate=16000,
#                     input=True,
#                     frames_per_buffer=8192)

#     try:
#         while True:
#             data = stream.read(4096)
#             if rec.AcceptWaveform(data):
#                 result = json.loads(rec.Result())
#                 recognized_text = result['text']
#                 print(recognized_text)
#                 if "honey shut down please" in recognized_text.lower():
#                     print("Termination keyword detected. Stopping...")
#                     break

#     except KeyboardInterrupt:
#         print("User interrupted the program.")

#     finally:
#         stream.stop_stream()
#         stream.close()
#         p.terminate()

# def record_transcript_sr():
#     while True:
#         try:
#             with sr.Microphone() as source:
#                 recognizer.adjust_for_ambient_noise(source, duration=0.2)
#                 audio = recognizer.listen(source)
#                 transcript = recognizer.recognize_vox(audio)
#                 return transcript

#          except sr.RequestError as e:
#             print("Request Error Occurred: {0}".format(e))
#             return

#         except sr.UnknownValueError:
#             print("Unknown Error Occurred")
#             return

# if __name__ == "__main__":
#     print("Listening for speech. Say 'Terminate' to stop.")
#     record_transcript_vosk()

# --------------
