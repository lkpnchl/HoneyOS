import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import NotepadDialog from "./Notepad.js";
import notepadIcon from "../../assets/img/notepad icon.png";

export function Notepad() {
  const [dialogCount, setDialogCount] = useState(1);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3000/ws');
    setWs(socket);

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (event) => {
      const message = event.data;
      if (message === 'notepad_triggered') {
        handleAddDialog();
      }
    };
  }, [ws]);

  const renderDialogs = () => {
    const dialogs = [];
    for (let i = 0; i < dialogCount; i++) {
      dialogs.push(
          <NotepadDialog key={`dialog_${i}`}/>
      );
    }
    return dialogs;
  };

  const handleAddDialog = () => {
    setDialogCount(prevCount => prevCount + 1);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button id="notepad-button" variant="link" className="transparent" onClick={handleAddDialog}>
            <img src={notepadIcon} alt="notepad-icon" height="100" width="100" />
        </button>
      </DialogTrigger>
      {renderDialogs()}
    </Dialog>
  );
}


// Notepad.js

// Notepad.js

export const openNotepad = () => {
  // Find and click the Notepad button
  const notepadButton = document.getElementById('notepad-button');
  if (notepadButton) {
    notepadButton.click();
  } else {
    console.error('Notepad button not found');
  }
};



