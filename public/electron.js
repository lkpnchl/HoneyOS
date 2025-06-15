const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require('child_process');
const { fork } = require('child_process');
const url = require("url")
const remote = require('@electron/remote/main');

console.log('Electron main process started');

let mainWindow;
let splashScreen;
let expressProcess;
remote.initialize();
let voiceServerPort = null;

function createSplashScreen() {
    splashScreen = new BrowserWindow({
      width: 800,
      height: 650,
      frame: false,
      fullscreen: true,
      transparent: true,
      skipTaskbar: true,
      icon: path.join(__dirname, "./logo.ico"),
      alwaysOnTop: false
    });
    
      splashScreen.loadURL(
          url.format({
		  pathname: path.join(__dirname, '../src/frontend/components/splash.html'),
          protocol: 'file:',
          slashes: true
          })
      );
  
    splashScreen.on('closed', () => {
      splashScreen = null;
    });
  }

let cameraWindow;

// Update your createCameraWindow function
function createCameraWindow() {
    cameraWindow = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
      },
    });
  
    // Enable remote module for this window
    remote.enable(cameraWindow.webContents);
  
    cameraWindow.loadFile(path.join(__dirname, "../src/frontend/components/camera/index.html"));

    cameraWindow.on("closed", () => {
      cameraWindow = null;
    });
  }
  
function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		frame: false, 
		center: true,
		resizable: false,
		maximizable: true,
        alwaysOnTop: false,
        fullscreen: true,
		icon: path.join(__dirname, "./logo.ico"),
		webPreferences: {
            nodeIntegration: true,
			contextIsolation: true,
			sandbox: false,
            preload: path.join(__dirname, 'preload.js')
		},
	});

    // and load the index.html of the app.
    const appURL = app.isPackaged
        ? `file://${path.join(__dirname, "index.html")}`
        : "http://localhost:3000";
    mainWindow.loadURL(appURL);

    // Open the DevTools.
    if (!app.isPackaged) {
        mainWindow.webContents.openDevTools();
    }

	mainWindow.once('ready-to-show', () => {
		// Show the window only when all assets are loaded
		mainWindow.show();
		if (splashScreen) {
			splashScreen.close();
		}
        // Start voice server after window is ready
        runServer();
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

// Run Express server
function runServer() {
    console.log('Starting voice recognition server...');
    const serverPath = path.join(__dirname, '../src/frontend/components/voiceRecog/backend.js');
    console.log('Server path:', serverPath);
    
    expressProcess = fork(serverPath, [], {
        stdio: ['pipe', 'pipe', 'pipe', 'ipc']
    });

    expressProcess.stdout.on('data', (data) => {
        console.log(`Voice Server: ${data}`);
    });

    expressProcess.stderr.on('data', (data) => {
        console.error(`Voice Server Error: ${data}`);
    });

    expressProcess.on('message', (message) => {
        console.log('Received message from voice server:', message);
        if (message.type === 'PORT') {
            voiceServerPort = message.port;
            console.log('Voice server running on port:', voiceServerPort);
            if (mainWindow && mainWindow.webContents) {
                mainWindow.webContents.send('voice-server-port', voiceServerPort);
            }
        }
    });

    expressProcess.on('error', (error) => {
        console.error('Voice server error:', error);
    });

    expressProcess.on('close', (code) => {
        console.log(`Voice server process exited with code ${code}`);
    });
}

app.whenReady().then(() => {
    console.log('App is ready')
    createSplashScreen();
    setTimeout(createWindow, 10000); // Change delay as needed
    // setTimeout(runServer, 9000); // Start Express server after a delay
    ipcMain.on("open-camera", () => {
        if (cameraWindow) {
            console.log("Camera window already open.");
            cameraWindow.focus(); // Bring the existing window to the front
            return;
        }
        console.log("Opening camera...");
        createCameraWindow();
    });
    ipcMain.on("minimize-camera", () => {
        if (cameraWindow) {
            cameraWindow.minimize();
        }
    });
    // Handle "close-camera" event
    ipcMain.on("close-camera", () => {
        if (cameraWindow) {
            console.log("Closing camera...");
            cameraWindow.close();
        }
    });
    // Handle "capture-photo" event
    ipcMain.on("capture-photo", () => {
        if (cameraWindow) {
            console.log("Sending capture photo command to camera window...");
            cameraWindow.webContents.send("capture-photo");
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('before-quit', () => {
    if (expressProcess) {
        expressProcess.kill(); // Kill voice server process when quitting Electron app
    }
});

// Add IPC handler to respond to port requests from renderer
ipcMain.on('get-voice-server-port', (event) => {
    if (voiceServerPort) {
        event.sender.send('voice-server-port', voiceServerPort);
    }
});