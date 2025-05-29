import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Mic, MicOff } from 'lucide-react';
import { openNotepad, closeNotepad } from '../notepad';
import { openPCB, closePCB } from '../pcb';
import { openReplacement, closeReplacement } from '../replacementAlgo';
import { useNavigate } from 'react-router-dom';

function speak(text) {
    if ('speechSynthesis' in window) {
        const utterance = new window.SpeechSynthesisUtterance(text);
        // Optionally, you can set voice, pitch, rate, etc. here
        window.speechSynthesis.speak(utterance);
    }
}

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
            const transcriptText = line.substring('TRANSCRIPT:'.length).trim();
            // Special greeting case
            if (/^hi honey$/i.test(transcriptText) || /^honey please hi honey$/i.test(transcriptText)) {
                const greeting = "Hello honey, what can I do for you today?";
                speak(greeting);
                return;
            }
            setTranscript(transcriptText);
            return;
        }

        // Handle commands
        if (line.startsWith('COMMAND:')) {
            const command = line.substring('COMMAND:'.length);
            // Show confirmation for recognized commands
            let confirmation = '';
            switch (command) {
                case 'OPEN_NOTEPAD':
                    confirmation = "Okay, I'll open notepad.";
                    break;
                case 'CLOSE_NOTEPAD':
                    confirmation = "Okay, I'll close notepad.";
                    break;
                case 'OPEN_PCB':
                    confirmation = "Okay, I'll open PCB.";
                    break;
                case 'CLOSE_PCB':
                    confirmation = "Okay, I'll close PCB.";
                    break;
                case 'OPEN_REPLACEMENT':
                    confirmation = "Okay, I'll open replacement.";
                    break;
                case 'CLOSE_REPLACEMENT':
                    confirmation = "Okay, I'll close replacement.";
                    break;
                case 'OPEN_CAMERA':
                    confirmation = "Okay, I'll open camera.";
                    break;
                case 'CLOSE_CAMERA':
                    confirmation = "Okay, I'll close camera.";
                    break;
                case 'SHUTDOWN':
                    break;
                case 'CAPTURE_PHOTO':
                    confirmation = "Okay, I'll capture a photo.";
                    break;
                case 'SAVE_PHOTO':
                    confirmation = "Okay, I'll save the photo.";
                    break;
                case 'RETAKE_PHOTO':
                    confirmation = "Okay, I'll retake the photo.";
                    break;
                case 'CHOOSE_FIFO':
                    confirmation = "Okay, I'll choose FIFO algorithm.";
                    break;
                case 'CHOOSE_SJF':
                    confirmation = "Okay, I'll choose SJF algorithm.";
                    break;
                case 'CHOOSE_PRIORITY':
                    confirmation = "Okay, I'll choose priority algorithm.";
                    break;
                case 'CHOOSE_RR':
                    confirmation = "Okay, I'll choose RR algorithm.";
                    break;
                case 'START_SIMULATION':
                    confirmation = "Okay, I'll start simulation.";
                    break;
                case 'RESUME_SIMULATION':
                    confirmation = "Okay, I'll resume simulation.";
                    break;
                case 'COMPLETE_SIMULATION':
                    confirmation = "Okay, I'll complete simulation.";
                    break;
                case 'STEP_SIMULATION':
                    confirmation = "Okay, I'll step simulation.";
                    break;
                case 'RESET_SIMULATION':
                    confirmation = "Okay, I'll reset simulation.";
                    break;
                case 'CHOOSE_REPLACEMENT_FIFO':
                    confirmation = "Okay, I'll choose FIFO replacement policy.";
                    break;
                case 'CHOOSE_REPLACEMENT_LRU':
                    confirmation = "Okay, I'll choose LRU replacement policy.";
                    break;
                case 'CHOOSE_REPLACEMENT_OPT':
                    confirmation = "Okay, I'll choose OPT replacement policy.";
                    break;
                case 'CHOOSE_REPLACEMENT_CLOCK':
                    confirmation = "Okay, I'll choose Clock replacement policy.";
                    break;
                case 'START_REPLACEMENT_SIMULATION':
                    confirmation = "Okay, I'll start replacement simulation.";
                    break;
                case 'PAUSE_REPLACEMENT_SIMULATION':
                    confirmation = "Okay, I'll pause replacement simulation.";
                    break;
                case 'STEP_REPLACEMENT_SIMULATION':
                    confirmation = "Okay, I'll step replacement simulation.";
                    break;
                case 'RESET_REPLACEMENT_SIMULATION':
                    confirmation = "Okay, I'll reset replacement simulation.";
                    break;
                case 'NEW_NOTE':
                    confirmation = "Okay, I'll create a new note.";
                    break;
                case 'OPEN_NOTE':
                    confirmation = "Okay, I'll open a note.";
                    break;
                case 'SAVE_NOTE':
                    confirmation = "Okay, I'll save the note.";
                    break;
                case 'SAVE_AS_NOTE':
                    confirmation = "Okay, I'll save the note as.";
                    break;
                default:
                    confirmation = '';
            }
            if (confirmation) {
                // Only speak confirmation, do not set transcript
                speak(confirmation);
            }
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
            if (!text.toLowerCase().startsWith('honey please')) {
                const errorMsg = "Please say 'please' before your command.";
                setTranscript(errorMsg);
                speak(errorMsg);
                return;
            }
            // If it doesn't match any known command keywords, show friendly error
            if (!text.match(/open|close|shut down|notepad|pcb|replacement|camera|capture|take photo|take picture/i)) {
                const errorMsg = "I don't recognize that command, can you repeat that please?";
                setTranscript(errorMsg);
                speak(errorMsg);
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
            case 'CAPTURE_PHOTO':
                if (window.electron && window.electron.ipcRenderer) {
                    window.electron.ipcRenderer.send('capture-photo');
                }
                break;
            case 'SAVE_PHOTO':
                if (window.electron && window.electron.ipcRenderer) {
                    window.electron.ipcRenderer.send('save-photo');
                }
                break;
            case 'RETAKE_PHOTO':
                if (window.electron && window.electron.ipcRenderer) {
                    window.electron.ipcRenderer.send('retake-photo');
                }
                break;
            case 'CHOOSE_FIFO':
                if (window.selectPCBAlgorithm) window.selectPCBAlgorithm('fcfs');
                break;
            case 'CHOOSE_SJF':
                if (window.selectPCBAlgorithm) window.selectPCBAlgorithm('sjf');
                break;
            case 'CHOOSE_PRIORITY':
                if (window.selectPCBAlgorithm) window.selectPCBAlgorithm('p');
                break;
            case 'CHOOSE_RR':
                if (window.selectPCBAlgorithm) window.selectPCBAlgorithm('rr');
                break;
            case 'START_SIMULATION':
                if (window.pcbSimulationControl) window.pcbSimulationControl('start');
                break;
            case 'RESUME_SIMULATION':
                if (window.pcbSimulationControl) window.pcbSimulationControl('resume');
                break;
            case 'COMPLETE_SIMULATION':
                if (window.pcbSimulationControl) window.pcbSimulationControl('complete');
                break;
            case 'STEP_SIMULATION':
                if (window.pcbSimulationControl) window.pcbSimulationControl('step');
                break;
            case 'RESET_SIMULATION':
                if (window.pcbSimulationControl) window.pcbSimulationControl('reset');
                break;
            case 'CHOOSE_REPLACEMENT_FIFO':
                if (window.selectReplacementPolicy) window.selectReplacementPolicy('fifo');
                break;
            case 'CHOOSE_REPLACEMENT_LRU':
                if (window.selectReplacementPolicy) window.selectReplacementPolicy('lru');
                break;
            case 'CHOOSE_REPLACEMENT_OPT':
                if (window.selectReplacementPolicy) window.selectReplacementPolicy('opt');
                break;
            case 'CHOOSE_REPLACEMENT_CLOCK':
                if (window.selectReplacementPolicy) window.selectReplacementPolicy('clock');
                break;
            case 'START_REPLACEMENT_SIMULATION':
                if (window.replacementSimulationControl) window.replacementSimulationControl('start');
                break;
            case 'PAUSE_REPLACEMENT_SIMULATION':
                if (window.replacementSimulationControl) window.replacementSimulationControl('pause');
                break;
            case 'STEP_REPLACEMENT_SIMULATION':
                if (window.replacementSimulationControl) window.replacementSimulationControl('step');
                break;
            case 'RESET_REPLACEMENT_SIMULATION':
                if (window.replacementSimulationControl) window.replacementSimulationControl('reset');
                break;
            case 'NEW_NOTE':
                if (window.openNotepad) window.openNotepad();
                setTimeout(() => {
                    const notepadButton = document.getElementById('notepad-button');
                    if (notepadButton) notepadButton.click();
                    setTimeout(() => {
                        const buttons = document.querySelectorAll('button');
                        buttons.forEach(btn => {
                            if (btn.textContent && btn.textContent.trim().toLowerCase().includes('new')) {
                                btn.click();
                            }
                        });
                    }, 500);
                }, 100);
                break;
            case 'OPEN_NOTE':
                if (window.openNotepad) window.openNotepad();
                setTimeout(() => {
                    const notepadButton = document.getElementById('notepad-button');
                    if (notepadButton) notepadButton.click();
                    setTimeout(() => {
                        const buttons = document.querySelectorAll('button');
                        buttons.forEach(btn => {
                            if (btn.textContent && btn.textContent.trim().toLowerCase().includes('open')) {
                                btn.click();
                            }
                        });
                    }, 500);
                }, 100);
                break;
            case 'SAVE_NOTE':
                setTimeout(() => {
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach(btn => {
                        if (btn.textContent && btn.textContent.trim().toLowerCase().includes('save') && !btn.textContent.toLowerCase().includes('save as')) {
                            btn.click();
                        }
                    });
                }, 100);
                break;
            case 'SAVE_AS_NOTE':
                setTimeout(() => {
                    const buttons = document.querySelectorAll('button');
                    buttons.forEach(btn => {
                        if (btn.textContent && btn.textContent.trim().toLowerCase().includes('save as')) {
                            btn.click();
                        }
                    });
                }, 100);
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
