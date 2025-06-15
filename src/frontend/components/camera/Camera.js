import React, { useEffect } from "react";
import styles from "./notepad.module.css";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { Button } from "../../components/ui/button";
import camera from "../../assets/img/camera.png";


function Camera() {
  // Function to handle opening the camera

  useEffect(() => {
    console.log('window.electron:', window.electron);
    console.log('window.require available:', typeof window.require !== 'undefined');
  }, []);

  useEffect(() => {
    const cameraButton = document.getElementById('camera-button');
    if (cameraButton) {
      cameraButton.addEventListener('click', () => {
        if (window.electron && window.electron.ipcRenderer) {
          window.electron.ipcRenderer.send('open-camera');
          console.log('Camera request sent via IPC');
        } else {
          console.error('Electron IPC not available');
        }
      });
    }
  }, []);

  const handleOpenCamera = () => {
    try {
    console.log('Camera button clicked');
    console.log('window.electron available:', !!window.electron);
      // Check if we're in an Electron environment
      if (window.electron && window.electron.ipcRenderer) {
        // Using contextBridge pattern
        window.electron.ipcRenderer.send('open-camera');
        console.log('Sent open-camera event via contextBridge');
      } else if (window.require) {
        // Direct require pattern (if contextIsolation is false)
        try {
          const { ipcRenderer } = window.require('electron');
          ipcRenderer.send('open-camera');
          console.log('Sent open-camera event via direct require');
        } catch (error) {
          console.error('Failed to require electron:', error);
        }
      } else {
        console.error('Electron IPC not available - are you running in a browser environment?');
      }
    } catch (error) {
      console.error('Error opening camera:', error);
    }
  };

  return (
    <TooltipProvider>
      <div>
        {/* Tooltip Button to Open Camera */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              id="camera-button"
              variant="outline"
              icon="icon"
              className={`${styles.appIconButton} transparent`}
              onClick={handleOpenCamera}
            >
              <img src={camera} alt="camera-icon" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Open Camera
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}

export default Camera;