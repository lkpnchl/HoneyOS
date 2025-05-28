import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, MicOff } from 'lucide-react';
import { openNotepad, closeNotepad } from '../notepad';
import { openPCB, closePCB } from '../pcb';
import { openReplacement, closeReplacement } from '../replacementAlgo';
import { useNavigate } from 'react-router-dom';

export const VoiceRecog = () => {
    const [isListening, setListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [serverPort, setServerPort] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.electron?.onVoiceServerPort((port) => {
            console.log('[DEBUG][VoiceRecog] Received voice server port:', port);
            setServerPort(port);
        });
        window.electron?.requestVoiceServerPort(); // Always request the port on mount
    }, []);

    useEffect(() => {
        if (isListening && serverPort) {
            startListening();
        }
    }, [isListening, serverPort]);

    const startListening = async () => {
        console.log('[DEBUG][VoiceRecog] Listening...');
        setLoading(true);
        setError(null);

        try {
            console.log(`[DEBUG][VoiceRecog] Attempting fetch to http://localhost:${serverPort}/desktop`);
            const response = await fetch(`http://localhost:${serverPort}/desktop`, {
                method: 'POST',
            });

            if (!response.ok) {
                throw new Error(`HTTP error: ${response.statusText}`);
            }

            // Set up a reader for the stream
            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;
                
                const text = decoder.decode(value);
                const lines = text.split('\n');
                
                lines.forEach(line => {
                    if (line.trim()) {
                        console.log('Received:', line);
                        processCommand(line.trim());
                    }
                });
            }

        } catch (error) {
            console.error('Error:', error.message);
            setError('An error occurred while processing voice commands.');
        } finally {
            setLoading(false);
        }
    };

    const processCommand = (line) => {
        // Handle transcripts
        if (line.startsWith('TRANSCRIPT:')) {
            const transcriptText = line.substring('TRANSCRIPT:'.length);
            setTranscript(transcriptText);
            return;
        }

        // Handle commands
        if (line.startsWith('COMMAND:')) {
            const command = line.substring('COMMAND:'.length);
            executeCommand(command);
            return;
        }

        // Handle system messages
        if (line.startsWith('SYSTEM:')) {
            const status = line.substring('SYSTEM:'.length);
            console.log('System status:', status);
            if (status === 'STOPPED') {
                setListening(false);
            }
            return;
        }

        // Handle unrecognized commands
        if (line.startsWith('[VOICE] HEARD:')) {
            const text = line.substring('[VOICE] HEARD:'.length).trim();
            if (!text.match(/open|close|shut down/i)) {
                setTranscript("I don't understand that command. Please try again.");
            }
        }
    };

    const executeCommand = (command) => {
        switch (command) {
            case 'OPEN_NOTEPAD':
                openNotepad();
                break;
            case 'CLOSE_NOTEPAD':
                closeNotepad();
                break;
            case 'OPEN_PCB':
                openPCB();
                break;
            case 'CLOSE_PCB':
                closePCB();
                break;
            case 'OPEN_REPLACEMENT':
                openReplacement();
                break;
            case 'CLOSE_REPLACEMENT':
                closeReplacement();
                break;
            case 'OPEN_CAMERA':
                if (window.electron && window.electron.ipcRenderer) {
                    window.electron.ipcRenderer.send('open-camera');
                }
                break;
            case 'CLOSE_CAMERA':
                if (window.electron && window.electron.ipcRenderer) {
                    window.electron.ipcRenderer.send('close-camera');
                }
                break;
            case 'SHUTDOWN':
                setListening(false);
                navigate('/shutdown');
                break;
            default:
                console.log('Unknown command:', command);
        }
    };

    const toggleListening = () => {
        setListening((prevState) => !prevState);
    };

    return (
        <div className="flex flex-col items-center gap-2 w-full">
            <div className="flex items-center gap-2">
                <Button
                    onClick={toggleListening}
                    disabled={isLoading || !serverPort}
                    className={`drop-shadow-md rounded-full border-2 ${isListening ? 'border-green-500 bg-white' : 'border-zinc-700 bg-zinc-800'} focus:outline-none`}
                    variant=""
                    size="icon"
                >
                    {isListening
                        ? <Mic className='text-red-600' title="Mic is ON" />
                        : <MicOff className='text-gray-400' title="Mic is OFF" />
                    }
                </Button>
                
                {transcript && (
                    <div className="text-sm font-semibold text-yellow-200 max-w-[200px] truncate drop-shadow">
                        {transcript}
                    </div>
                )}
            </div>

            {error && (
                <div className="text-sm text-red-500">
                    {error}
                </div>
            )}

            {!serverPort && (
                <div className="text-sm text-yellow-500">
                    Voice server is starting up...
                </div>
            )}
        </div>
    );
};
