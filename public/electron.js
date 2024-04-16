const path = require("path");
const { app, BrowserWindow } = require("electron");
const { spawn } = require('child_process');
const url = require("url")

let mainWindow;
let splashScreen;
let expressProcess;

function createSplashScreen() {
    splashScreen = new BrowserWindow({
      width: 800,
      height: 650,
      frame: false,
      transparent: true,
      alwaysOnTop: true
    });
    
      splashScreen.loadURL(
          url.format({
          pathname: path.join(__dirname, 'splash.html'),
          protocol: 'file:',
          slashes: true
          })
      );
  
    splashScreen.on('closed', () => {
      splashScreen = null;
    });
  }
  
function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		frame: false, 
		center: true,
		resizable: true,
		maximizable: true,
		icon: path.join(__dirname, "./logo.ico"),
		webPreferences: {
			preload: path.join(__dirname, "../src/backend/controllers/preload.js"),
			nodeIntegration: true,
			contextIsolation: true,
			sandbox: false,
		},
	})

    // and load the index.html of the app.
    const appURL = app.isPackaged
        ? `file://${path.join(__dirname, "index.html")}`
        : "http://localhost:3000";
        mainWindow.loadURL(appURL);

    // Open the DevTools.
    // if (!app.isPackaged) {
    //     win.webContents.openDevTools();
    // }
	mainWindow.once('ready-to-show', () => {
		// Show the window only when all assets are loaded
		mainWindow.show();
		if (splashScreen) {
			splashScreen.close();
		}
	});

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

// Run Express server
function runServer() {
    expressProcess = spawn('node', ['src/frontend/components/voiceRecog/backend.js']);

    expressProcess.stdout.on('data', (data) => {
        console.log(`Express: ${data}`);
    });

    expressProcess.stderr.on('data', (data) => {
        console.error(`Express Error: ${data}`);
    });

    expressProcess.on('close', (code) => {
        console.log(`Express process exited with code ${code}`);
    });
}

app.whenReady().then(() => {
	createSplashScreen();
	setTimeout(createWindow, 14500); // Change delay as needed
    runServer(); // Start Express server
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
        expressProcess.kill(); // Kill Express server process when quitting Electron app
    }
});
