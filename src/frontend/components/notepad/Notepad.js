import styles from "./notepad.module.css";
import React, { useState, useEffect } from "react";
import Draggable from "react-draggable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { FolderOpenDot, FolderOpen, Save, SaveAll } from "lucide-react";
import notepadIcon from "../../assets/img/buzzpad.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"

function Notepad() {
  const [dialogCount, setDialogCount] = useState(1);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [fileContent, setFileContent] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

  // Add effect to listen for voice commands
  useEffect(() => {
    const handleVoiceCommand = (event) => {
      console.log('[Notepad] Received event:', event);
      if (event.detail === "COMMAND:CLOSE_NOTEPAD") {
        console.log('[Notepad] Closing notepad dialog...');
        handleClose();
      }
    };

    window.addEventListener('notepad-command', handleVoiceCommand);
    return () => window.removeEventListener('notepad-command', handleVoiceCommand);
  }, []);

  const handleClose = () => {
    if (isModified && !isSaved) {
      const confirmClose = window.confirm("You have unsaved changes. Are you sure you want to close the file?");
      if (confirmClose) {
        closeDialog();
      }
    } else {
      closeDialog();
    }
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setDialogCount(1);
    setFileContent("");
    setIsModified(false);
    setIsSaved(true);
  };

  const handleOpenNewFile = () => {
    setDialogCount(prevCount => prevCount + 1);
  };

  const handleOpenExistingFile = () => {
    console.log("Opening an existing file...");
    // Create a new file input element
    const input = document.createElement("input");
    input.type = "file";

    // Add event listener for when file is selected
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      console.log("Selected file:", file);

      // Read file content
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setFileContent(content);
      };
      reader.readAsText(file);
    });

    // Trigger click event to open file dialog
    input.click();
  };

  const handleSaveNewFile = () => {
    console.log("Saving a new file...");
    const extension = ".bzzz"; // Define the extension for new files
    const fileName = "new_file"; // Define the name for new files
    const content = fileContent; // Get the content from the state

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}${extension}`; // Set the download attribute with the file name and extension
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    setIsSaved(true); // Mark the file as saved after saving

  };


  const handleSaveExistingFile = () => {
    console.log("Saving an existing file...");
    // Example: You can prompt user to save content as a file
    
    const extension = ".bzzz"; // Define the extension for new files
    const fileName = "new_file"; // Define the name for new files
    const content = fileContent; // Get the content from the state

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}${extension}`; // Set the download attribute with the file name and extension
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    setIsSaved(true); // Mark the file as saved after saving
    setIsModified(false); // Reset modification state to false after saving
    setSaveButtonDisabled(true); // Disable the "Save" button after saving a new file
  };

  const handleChange = (event) => {
    setFileContent(event.target.value);
    setIsModified(true); // Set modification state to true when content changes
    setIsSaved(false); // Mark the file as not saved when modified
    setSaveButtonDisabled(false); // Enable the Save button when content changes

  };

  const renderDialogContent = () => {
    const dialogContentArray = [];
    for (let i = 0; i < dialogCount; i++) {
      dialogContentArray.push(
        <>
          <Draggable handle=".dialog-title" positionOffset={{ x: '-50%', y: '-55%' }}>
            <DialogContent key={i} className="w-9/12 h-5/6 flex" style={{ position: 'fixed', top: '50', left: '50' }}>
              <div className="w-1/4">
                <DialogHeader className="dialog-title">
                  <DialogTitle className="text-s">BuzzNote</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col">
                  <div className="mb-2">
                    <Button
                      style={{
                        color: "black",
                        width: "200px",
                        height: "40px",
                        textAlign: "left",
                        display: "block",
                        marginBottom: "8px",
                      }}
                      onClick={handleOpenNewFile}
                    >
                      <FolderOpen className="mr-2 h-4 w-4 inline-block align-middle" />{" "}
                      New
                    </Button>
                  </div>
                  <div className="mb-2">
                    <Button
                      style={{
                        color: "black",
                        width: "200px",
                        height: "40px",
                        textAlign: "left",
                        display: "block",
                        marginBottom: "8px",
                      }}
                      onClick={handleOpenExistingFile}
                    >
                      <FolderOpenDot className="mr-2 h-4 w-4 inline-block align-middle" />{" "}
                      Open
                    </Button>
                  </div>
                  <div className="mb-2">
                    <Button
                      style={{
                        color: "black",
                        width: "200px",
                        height: "40px",
                        textAlign: "left",
                        display: "block",
                        marginBottom: "8px",
                      }}
                      onClick={handleSaveNewFile}
                    >
                      <Save className="mr-2 h-4 w-4 inline-block align-middle" />
                      Save
                    </Button>

                  </div>
                  <div className="mb-2">
                    <Button
                      style={{
                        color: "black",
                        width: "200px",
                        height: "40px",
                        textAlign: "left",
                        display: "block",
                        marginBottom: "8px",
                      }}
                      onClick={handleSaveExistingFile}
                      disabled={saveButtonDisabled} // Disable the button when saveButtonDisabled is true
                    >
                      <SaveAll className="mr-2 h-4 w-4 inline-block align-middle" />{" "}
                      Save as
                    </Button>
                  </div>
                </div>
              </div>
              <div className="w-full">
                <Textarea
                  className="mt-8 flex-grow"
                  placeholder="Type your message here."
                  value={fileContent}
                  onChange={handleChange}
                />
                <div className="flex justify-end">
                  <DialogClose asChild>
                    <Button className="mt-4 text-black" onClick={handleClose}>Close</Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>
          </Draggable>
        </>
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
                  id="notepad-button" 
                  variant="outline" 
                  icon="icon"
                  className={`${styles.appIconButton} transparent`}
                >
                  <img src={notepadIcon} alt="BuzzNote"/>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                BuzzNote
              </TooltipContent>
            </Tooltip>
          </div>
        </DialogTrigger>
        {renderDialogContent()}
      </Dialog>
    </TooltipProvider>
  );
}

export const closeNotepad = () => {
  console.log('[Notepad] Attempting to close notepad dialog...');
  const notepadButton = document.getElementById('notepad-button');
  if (notepadButton) {
    const closeEvent = new CustomEvent('message', { data: 'COMMAND:CLOSE_NOTEPAD' });
    window.dispatchEvent(closeEvent);
  }
};

export default Notepad;
