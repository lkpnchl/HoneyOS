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
            {/* Voice automatically stops when we stop speaking for temporary usage */}
            <Button onClick={stopListening}>Stop</Button>
          </div>

          {isListening ? 
            <div> 
              App is listening 
            </div>
            : null}
          {transcript}
        </>
      ) : (
        <div> 
          Browser does not support speech recognition 
        </div>
      )}
    </div>
  );
};
