import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, MicOff } from 'lucide-react';
import { openNotepad } from '../notepad'

export const VoiceRecog = () => {
    const [isListening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isListening) {
            startListening();
        }
    }, [isListening]);

    const startListening = async () => {
        console.log('Listening...');
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/desktop', {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.statusText}`);
            }

            const data = await response.text();
            setTranscript(data);
            console.log('Data received:', data);

            // Create functions based on the received data
            processTranscript(data);

            if (isListening) {
                startListening(); // If still listening, call startListening() again
            }
        } catch (error) {
            console.error('Error:', error.message);
            setError('An error occurred while fetching data.');
        } finally {
            setLoading(false);
        }
    };

    const toggleListening = () => {
        setListening((prevState) => !prevState);
    };

    // Example function creation based on transcript data
    const processTranscript = (transcriptData) => {
        // Check if the transcript contains the specific phrase
        if (transcriptData.toLowerCase().includes('honey open notepad please')) {
            // Trigger the function to open the notepad
            openNotepad();
        }
    }

    return (
        <div className="flex flex-col items-center gap-5 w-full">
            <div>
            <Button onClick={toggleListening} disabled={isLoading} className="drop-shadow-md rounded-full border-2 border-zinc-50 outline-yellow-50" variant="outline" size="icon">
              {isListening ? <MicOff /> : <Mic />}
            </Button>
            </div>
            
            {transcript}

            {isListening ? console.log("Listening") : null}

            {error && console.log(error)}

        </div>
    );
};
