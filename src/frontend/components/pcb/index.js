// import styles from "./pcb.module.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import pcbIcon from "../../assets/img/bee.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"
import PCB from "../../pages/pcb"
import styles from './pcb.module.css';

function BusyBee() {
  const [dialogCount, setDialogCount] = useState(1);
  const [dialogStates, setDialogStates] = useState(
    Array.from({ length: 1 }, () => true)
  );
  const [processControlBlocks, setProcessControlBlocks] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);

  // Add effect to listen for voice commands
  useEffect(() => {
    const handleVoiceCommand = (event) => {
      console.log('[PCB] Received event:', event);
      if (event.detail === "COMMAND:CLOSE_PCB") {
        console.log('[PCB] Closing PCB dialog...');
        handleClose();
      }
    };

    window.addEventListener('pcb-command', handleVoiceCommand);
    return () => window.removeEventListener('pcb-command', handleVoiceCommand);
  }, []);

  const handleClose = () => {
    setDialogVisible(false);
    setDialogCount(1);
    setDialogStates(Array.from({ length: 1 }, () => true));
  };

  const text = "BusyBee (PCB)";
  const letters = text.split('')

  const renderDialogContent = () => {
    const dialogContentArray = [];
    for (let i = 0; i < dialogCount; i++) {
      dialogContentArray.push(
        <React.Fragment key={i}>
          <Draggable handle=".dialog-title" positionOffset={{ x: '-50%', y: '-56%' }}>
            <DialogContent className={`${styles.dialogContainer} w-[98%] h-[86%] flex`} style={{ position: 'fixed', top: '50', left: '50' }}>
              <div className="w-full">
                <DialogTitle className="flex item-center justify-center">
                  <div style={{ display: 'inline', alignItems: 'center' }} className={`${styles.mahStroke} justify-center dialog-title pt-2 flex flex-col space-y-1.5 text-black mahStroke text-center`}>{letters.map((letter, index) => (
                        <h2
                          key={index} style={{ display: 'inline' }}
                          className={index % 2 === 0 ? "text-yellow-600 text-center" : "text-amber-900 text-center"}
                        >
                          {letter}
                        </h2>
                      ))}
                  </div>
                </DialogTitle>
                  <PCB />
              </div>
            </DialogContent>
          </Draggable>
        </React.Fragment>
      );
    }
    return dialogContentArray;
  };

  return (
    <TooltipProvider>
      <Dialog open={dialogVisible} onOpenChange={setDialogVisible}>
        <DialogTrigger asChild>
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  id="pcb-button" 
                  variant="outline" 
                  icon="icon"
                  className={`${styles.appIconButton} transparent`}
                >
                  <img src={pcbIcon} alt="BusyBee (PCB)"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                BusyBee (PCB)
              </TooltipContent>
            </Tooltip>
          </div>
        </DialogTrigger>
        {renderDialogContent()}
      </Dialog>
    </TooltipProvider>
  );
}

export const openPCB = () => {
  console.log('[PCB] Attempting to open PCB dialog...');
  const pcbButton = document.getElementById('pcb-button');
  if (pcbButton) {
    console.log('[PCB] PCB button found, clicking...');
    pcbButton.click();
  } else {
    console.error('[PCB] PCB button not found');
    // Try an alternative approach if button not found
    const dialogs = document.querySelectorAll('button');
    const pcbDialogButton = Array.from(dialogs).find(btn => 
      btn.textContent?.includes('BusyBee') || 
      btn.querySelector('img[alt="BusyBee (PCB)"]')
    );
    
    if (pcbDialogButton) {
      console.log('[PCB] Found alternative PCB button, clicking...');
      pcbDialogButton.click();
    } else {
      console.error('[PCB] Could not find any PCB button');
    }
  }
};

export const closePCB = () => {
  console.log('[PCB] Attempting to close PCB dialog...');
  const closeEvent = new CustomEvent('pcb-command', { 
    detail: 'COMMAND:CLOSE_PCB'
  });
  window.dispatchEvent(closeEvent);
};

export default BusyBee;


