const { contextBridge } = require("electron");
const express = require('express');
const fs = require('fs');
const path = require('path');

// Define the setupFileManagementRoutes function
function setupFileManagementRoutes(app) {
    // Serve static files from the 'public' directory
    app.use(express.static('public'));

    // Endpoint to open a file (either new or existing)
    app.get('/open-file/:fileName', (req, res) => {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, 'files', fileName);

        // Check if the file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // File doesn't exist, treat as opening a new file
                res.send('');
            } else {
                // File exists, read its content and send it back
                fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                        res.status(500).send('Error reading file');
                    } else {
                        res.send(data);
                    }
                });
            }
        });
    });

    // Endpoint to save a file (either new or existing)
    app.post('/save-file/:fileName', (req, res) => {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, 'files', fileName);
        const content = req.body.content;

        // Write content to the file
        fs.writeFile(filePath, content, 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error saving file');
            } else {
                res.send('File saved successfully');
            }
        });
    });

    // Endpoint to close a file
    app.post('/close-file/:fileName', (req, res) => {
        const fileName = req.params.fileName;
        const filePath = path.join(__dirname, 'files', fileName);

        // Clear the content of the file
        fs.writeFile(filePath, '', 'utf8', (err) => {
            if (err) {
                res.status(500).send('Error closing file');
            } else {
                res.send('File closed successfully');
            }
        });
    });
}

// Define a function to set up the Express app
function setupExpressApp() {
    // Create an Express app instance
    const app = express();
    const port = 3000;

    app.use(express.json());

    // Set up file management routes
    setupFileManagementRoutes(app);

    // Start the Express server
    app.listen(port, () => {
        console.log(`Express server listening at http://localhost:${port}`);
    });

    // Return the Express app instance
    return app;
}

// Call the function to set up the Express app and expose it to the renderer process
const expressApp = setupExpressApp();
contextBridge.exposeInMainWorld("expressApp", expressApp);
