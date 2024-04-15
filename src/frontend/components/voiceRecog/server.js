const express = require('express');
const app = express();
const { spawn } = require('child_process');
const cors = require('cors');
const async = require('async');
const expressWs = require('express-ws')(app); // Initialize express-ws

app.use(cors());
app.use(express.text()); // Parse request body as text

app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.path}`);
    next();
});

const PORT = 3000;

// Create a queue to process Python scripts sequentially
const pythonQueue = async.queue((task, callback) => {
    const { pythonScriptPath, res, data } = task;

    const pythonProcess = spawn('python', [pythonScriptPath]);

    let scriptOutput = '';

    pythonProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
        scriptOutput += data.toString();
        res.write(scriptOutput); // Write the output to the response stream
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send("Error in Python script execution.");
    });

    pythonProcess.on('exit', (code) => {
        console.log(`Python process exited with code ${code}`);
        if (code === 0) {
            res.end(); // End the response stream
        } else {
            res.status(500).send(`Python script exited with code ${code}`);
        }
        callback(); // Signal that the task is complete
    });

    // Pass the data to the Python script via stdin
    pythonProcess.stdin.write(JSON.stringify(data));
    pythonProcess.stdin.end();
}, 1); // Limit concurrency to 1, so only one script runs at a time

// Define route handler for POST request to '/desktop'
app.post('/desktop', (req, res) => {
    const pythonScriptPath = 'src/frontend/components/voicerecog/voice_recog.py';
    const data = req.body; // Get the string data from the request body

    // Set up response as a stream
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked'
    });

    // Add the task to the queue
    pythonQueue.push({ pythonScriptPath, res, data }, (err) => {
        if (err) {
            console.error('Error processing Python script:', err);
            res.status(500).send('Internal server error');
        }
    });
});

// WebSocket endpoint
app.ws('/ws', (ws, req) => {
    console.log('WebSocket connection established');
    
    // Handle WebSocket messages
    ws.on('message', (message) => {
        console.log(`Received message from client: ${message}`);
        
        // Echo the message back to the client
        ws.send(`Server received: ${message}`);
    });
});

// Start the server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
