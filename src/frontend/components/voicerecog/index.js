import useSpeechRecognition from "./voice.js";
import { Button } from "../ui/button";

export const VoiceRecog = () => {
  const {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();

  return (
    <div>
      {hasRecognitionSupport ? (
        <>
          <div>
            <Button onClick={startListening} variant="destructive">Start</Button>
          </div>

          <div>
            <Button onClick={stopListening}>Stop</Button>
          </div>

          {isListening ? (
            <div> 
              App is listening 
              {console.log("Listening")}
            </div>
          ) : (
            <>
              {console.log("StopListening")}
            </>
          )}
          <h3>{transcript}</h3>
        </>
      ) : (
        <div> 
          Browser does not support speech recognition 
        </div>
      )}
    </div>
  );
};
