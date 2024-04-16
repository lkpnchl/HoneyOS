import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button"; // Import necessary components
import NotepadDialog from "./notepad"; // Import the dialog component
import notepadIcon from "../../assets/img/notepad icon.png";

function Notepad() {
  const [dialogCount, setDialogCount] = useState(1);

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
        <Button onClick={handleAddDialog}>
          <img src={notepadIcon} alt="notepad-icon" height="100" width="100" />
        </Button>
      </DialogTrigger>
      {renderDialogs()}
    </Dialog>
  );
}

export default Notepad;
