import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';

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

    return (
        <div>
            <div>
                <Button onClick={toggleListening} variant="destructive" disabled={isLoading}>
                    {isListening ? 'Stop' : 'Start'}
                </Button>
            </div>

            {isListening ? <div>App is listening</div> : null}

            {error && <div>Error: {error}</div>}

            <h3>{transcript}</h3>
        </div>
    );
};