import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { X } from "lucide-react";
import ReplacementPage from "../../pages/replacement";
import styles from './replacement.module.css';

// Import a placeholder icon until you have a real one
import memoryIcon from "../../assets/img/memory-icon.png";

function ReplacementAlgo() {
  const [dialogVisible, setDialogVisible] = useState(false);

  // Listen for voice command to close replacement dialog
  useEffect(() => {
    const handleVoiceCommand = (event) => {
      if (event.detail === "COMMAND:CLOSE_REPLACEMENT") {
        setDialogVisible(false);
      }
    };
    window.addEventListener('replacement-command', handleVoiceCommand);
    return () => window.removeEventListener('replacement-command', handleVoiceCommand);
  }, []);

  return (
    <TooltipProvider>
      <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
        <DialogTrigger asChild>
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  id="replacement-button" 
                  variant="outline" 
                  icon="icon"
                  className={`${styles.appIconButton} transparent`}
                  onClick={() => setDialogVisible(true)}
                >
                  <img src={memoryIcon} alt="Page Replacement" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Page Replacement
              </TooltipContent>
            </Tooltip>
          </div>
        </DialogTrigger>
        
        <Draggable handle=".dialog-title" bounds="parent">
          <DialogContent className={styles.dialogContainer}>
            <div className="w-full h-full flex flex-col overflow-hidden">
              <div className="dialog-title flex items-center justify-between cursor-move bg-amber-400 px-4 py-2 rounded-t-md">
                <div className="flex-1 text-center">
                  <h2 className={styles.dialogTitle}>
                    <span className="text-amber-900">PAGE </span>
                    <span className="text-yellow-600">REPLACEMENT</span>
                  </h2>
                </div>
              </div>
              <div className="flex-1 overflow-hidden p-1">
                <ReplacementPage />
              </div>
            </div>
          </DialogContent>
        </Draggable>
      </Dialog>
    </TooltipProvider>
  );
}

export const openReplacement = () => {
  console.log('[Replacement] Attempting to open Replacement dialog...');
  const replacementButton = document.getElementById('replacement-button');
  if (replacementButton) {
    console.log('[Replacement] Replacement button found, clicking...');
    replacementButton.click();
  } else {
    console.error('[Replacement] Replacement button not found');
    // Try an alternative approach if button not found
    const dialogs = document.querySelectorAll('button');
    const replacementDialogButton = Array.from(dialogs).find(btn => 
      btn.textContent?.includes('Page Replacement') || 
      btn.querySelector('img[alt="Page Replacement"]')
    );
    
    if (replacementDialogButton) {
      console.log('[Replacement] Found alternative Replacement button, clicking...');
      replacementDialogButton.click();
    } else {
      console.error('[Replacement] Could not find any Replacement button');
    }
  }
};

export const closeReplacement = () => {
  console.log('[Replacement] Attempting to close Replacement dialog...');
  const closeEvent = new CustomEvent('replacement-command', { 
    detail: 'COMMAND:CLOSE_REPLACEMENT'
  });
  window.dispatchEvent(closeEvent);
};

export default ReplacementAlgo; 