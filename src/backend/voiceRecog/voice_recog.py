import vosk
import pyaudio
import json
import sys
import os
import time
import datetime
import threading

def log_with_timestamp(msg):
    print(f"[{datetime.datetime.now().isoformat()}] {msg}")
    sys.stdout.flush()

def log_timing(start_time, step_name):
    elapsed = time.time() - start_time
    log_with_timestamp(f"[TIMING] {step_name} took {elapsed:.2f} seconds")

def timeout_handler(signum, frame):
    raise TimeoutError("Model initialization timed out")

# Initialize Vosk model
script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "vosk-model-small-en-us-0.15")

def initialize_model():
    log_with_timestamp("[DEBUG] Starting model initialization...")
    model_start_time = time.time()
    model = vosk.Model(model_path)
    log_timing(model_start_time, "Model loading")
    return model

print("[DEBUG] Starting voice recognition script")
log_with_timestamp("[DEBUG] Starting voice recognition script")

total_start_time = time.time()

log_with_timestamp(f"[DEBUG] Loading Vosk model from: {model_path}")
log_with_timestamp(f"[DEBUG] Model directory exists: {os.path.exists(model_path)}")
log_with_timestamp(f"[DEBUG] Model directory contents: {os.listdir(model_path)}")

# Initialize model with timeout
model = None
model_thread = threading.Thread(target=lambda: globals().update({'model': initialize_model()}))
model_thread.daemon = True
model_thread.start()
model_thread.join(timeout=30)  # Wait up to 30 seconds

if model is None:
    log_with_timestamp("[ERROR] Model initialization timed out after 30 seconds")
    sys.exit(1)

log_with_timestamp("[DEBUG] Creating KaldiRecognizer...")
recognizer_start_time = time.time()
rec = vosk.KaldiRecognizer(model, 16000)
log_timing(recognizer_start_time, "KaldiRecognizer creation")

log_timing(total_start_time, "Total initialization")

def process_command(text):
    """Process the recognized text and extract commands directly"""
    text = text.lower().strip()
    
    # Skip processing if text is too short or just filler words
    if len(text) < 3 or text in ['huh', 'um', 'uh', 'ah', 'eh']:
        return True
        
    print(f"[DEBUG] Processing command: {text}")
    print(f"[DEBUG] Extracted command: {text}")

    # Command mapping
    if "open notes" in text or "open notepad" in text:
        print("COMMAND:OPEN_NOTEPAD")
    elif "close notes" in text or "close notepad" in text:
        print("COMMAND:CLOSE_NOTEPAD")
    elif "open pcb" in text or "open process control block" in text or "open busy bee" in text:
        print("COMMAND:OPEN_PCB")
        sys.stdout.flush()  # Extra flush for PCB commands
    elif "close pcb" in text or "close process control block" in text or "close busy bee" in text:
        print("COMMAND:CLOSE_PCB")
        sys.stdout.flush()  # Extra flush for PCB commands
    elif "open replacement" in text or "open page replacement" in text or "open memory simulator" in text:
        print("COMMAND:OPEN_REPLACEMENT")
        sys.stdout.flush()  # Extra flush for replacement commands
    elif "close replacement" in text or "close page replacement" in text or "close memory simulator" in text:
        print("COMMAND:CLOSE_REPLACEMENT")
        sys.stdout.flush()  # Extra flush for replacement commands
    elif "open camera" in text or "start camera" in text:
        print("COMMAND:OPEN_CAMERA")
        sys.stdout.flush()
    elif "close camera" in text or "stop camera" in text:
        print("COMMAND:CLOSE_CAMERA")
        sys.stdout.flush()
    elif "capture" in text or "take photo" in text or "take picture" in text:
        print("COMMAND:CAPTURE_PHOTO")
        sys.stdout.flush()
    elif "shut down" in text:
        print("COMMAND:SHUTDOWN")
        return False
    else:
        # Log unrecognized commands for debugging
        print(f"[DEBUG] Unrecognized command: {text}")

    sys.stdout.flush()  # Ensure the command is sent immediately
    return True

def record_transcript_vosk():
    """Record and process voice input using Vosk"""
    log_with_timestamp("[DEBUG] Initializing PyAudio...")
    p = pyaudio.PyAudio()
    
    # List available audio devices
    log_with_timestamp("[DEBUG] Available audio devices:")
    for i in range(p.get_device_count()):
        dev_info = p.get_device_info_by_index(i)
        log_with_timestamp(f"[DEBUG] Device {i}: {dev_info['name']}")
    
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
            try:
                data = stream.read(4096, exception_on_overflow=False)
                # Get partial results
                if rec.AcceptWaveform(data):
                    result = json.loads(rec.Result())
                    recognized_text = result.get('text', '').strip()
                    if recognized_text:
                        log_with_timestamp(f"[VOICE] HEARD: {recognized_text}")
                        print(f"TRANSCRIPT:{recognized_text}")
                        sys.stdout.flush()
                        
                        if not process_command(recognized_text):
                            break
                else:
                    # Print partial results
                    partial = json.loads(rec.PartialResult())
                    partial_text = partial.get('partial', '').strip()
                    if partial_text:
                        log_with_timestamp(f"[VOICE] LISTENING: {partial_text}")
                        sys.stdout.flush()
            except IOError as e:
                log_with_timestamp(f"[DEBUG] Audio stream error: {str(e)}")
                continue

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
