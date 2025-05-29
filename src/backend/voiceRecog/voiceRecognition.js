const express = require('express');
const expressWs = require('express-ws');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
expressWs(app);

app.use(cors());
app.use(express.json());

let pythonProcess = null;
let initializationTimeout = null;

function killPythonProcess() {
    if (pythonProcess) {
        console.log('[DEBUG] Killing existing Python process');
        pythonProcess.kill();
        pythonProcess = null;
    }
    if (initializationTimeout) {
        clearTimeout(initializationTimeout);
        initializationTimeout = null;
    }
}

function logWithTimestamp(message) {
    const now = new Date().toISOString();
    console.log(`[${now}] ${message}`);
}

// Voice recognition endpoint
app.post('/desktop', (req, res) => {
    logWithTimestamp('[DEBUG] Voice recognition endpoint hit');
    
    // Set up SSE (Server-Sent Events)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Kill any existing Python process
    killPythonProcess();

    const scriptPath = path.join(__dirname, 'voice_recog.py');
    logWithTimestamp(`[DEBUG] Starting Python script at: ${scriptPath}`);

    // Start the Python voice recognition script
    const startPython = Date.now();
    pythonProcess = spawn('python', [scriptPath]);
    logWithTimestamp(`[DEBUG] Python process spawned with PID: ${pythonProcess.pid}`);

    // Set a timeout for initialization
    initializationTimeout = setTimeout(() => {
        logWithTimestamp('[DEBUG] Voice recognition initialization timeout after 2 minutes');
        res.write('ERROR:Initialization timeout after 2 minutes\n');
        killPythonProcess();
    }, 120000); // 2 minutes timeout

    let isInitialized = false;
    let pythonReadyTime = null;

    // Handle Python script output
    pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        logWithTimestamp(`[DEBUG] Python output: ${output.trim()}`);
        
        // Check for initialization success
        if (output.includes('SYSTEM:READY')) {
            pythonReadyTime = Date.now();
            logWithTimestamp(`[DEBUG] Voice recognition system ready (startup time: ${(pythonReadyTime - startPython) / 1000}s)`);
            isInitialized = true;
            if (initializationTimeout) {
                clearTimeout(initializationTimeout);
                initializationTimeout = null;
            }
        }
        
        res.write(output);
    });

    pythonProcess.stderr.on('data', (data) => {
        const error = data.toString();
        logWithTimestamp(`[DEBUG] Python stderr: ${error.trim()}`);
        // Only treat as fatal if it looks like a real error
        if (!isInitialized && (error.includes('Traceback') || error.toLowerCase().includes('error') || error.toLowerCase().includes('exception'))) {
            res.write(`ERROR:${error}\n`);
            logWithTimestamp('[DEBUG] Error during initialization');
            killPythonProcess();
        } else {
            // Just log normal Kaldi/Vosk output
            res.write(`LOG:${error}\n`);
        }
    });

    // Handle Python process errors
    pythonProcess.on('error', (error) => {
        logWithTimestamp(`[DEBUG] Failed to start Python process: ${error}`);
        res.write(`ERROR:Failed to start Python process: ${error.message}\n`);
        killPythonProcess();
    });

    // Handle client disconnect
    req.on('close', () => {
        logWithTimestamp('[DEBUG] Client disconnected');
        killPythonProcess();
    });

    // Handle Python process exit
    pythonProcess.on('close', (code) => {
        logWithTimestamp(`[DEBUG] Python process exited with code ${code}`);
        res.write('SYSTEM:STOPPED\n');
        killPythonProcess();
    });
});

// Start server on a random available port
const server = app.listen(0, () => {
    const port = server.address().port;
    logWithTimestamp(`[DEBUG] Voice recognition server running on port ${port}`);
    // Send port number to Electron main process
    if (process.send) {
        process.send({ type: 'PORT', port });
    }
});
