import speech_recognition as sr
import pyttsx3 

recognizer = sr.Recognizer()

def record_transcript():
    while True:
        try:
            with sr.Microphone() as source:
                recognizer.adjust_for_ambient_noise(source, duration=0.2)
                audio = recognizer.listen(source)
                transcript = recognizer.recognize_google(audio)
                return transcript

        except sr.RequestError as e:
            print("Request Error Occurred: {0}".format(e))
            return

        except sr.UnknownValueError:
            print("Unknown Error Occurred")
            return

if __name__ == "__main__":
    # while True:
        transcript = record_transcript()
        if transcript:
            print(transcript)

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
