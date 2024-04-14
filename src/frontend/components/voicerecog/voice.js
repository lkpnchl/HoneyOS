import { useEffect, useState } from "react"

let recognition = null

if ("webkitSpeechRecognition" in window) {
  recognition = new window.webkitSpeechRecognition()
  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = "en-US"
  recognition.start()
}

const useSpeechRecognition = () => {
  console.log("detectedAgain")
  const [transcript, setTranscript] = useState("")
  const [isListening, setListening] = useState(false)

  useEffect(() => {
    if (!recognition) return

    recognition.onresult = (event) => {
      console.log("result: ", event)
      setTranscript(event.results[0][0].transcript)
      recognition.stop()
      setListening(false)
    }
  }, [])

  const startListening = () => {
    setTranscript("")
    setListening(true)
    recognition.start()  
    console.log("detectedAgain")
  }

  const stopListening = () => {
    setListening(false)
    recognition.stop()
    console.log("detectSop")
  }

  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    hasRecognitionSupport: !!recognition,
  }
}

export default useSpeechRecognition
