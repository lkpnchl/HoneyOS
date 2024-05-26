// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import Draggable from "react-draggable";
// import VirtualMemory from "./VirtualMemory";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogClose,
// } from "../../components/ui/dialog";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../../components/ui/tabs";

// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Textarea } from "../../components/ui/textarea";

// import {
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableHeader,
// } from "../../components/ui/table";
// import { Copy, FolderOpenDot, FolderOpen, Save, SaveAll } from "lucide-react";
// import pcbIcon from "../../assets/img/bee.png";
// import styles from "./pcb.module.css";
// import { generateRandomProcessControlBlock } from "./dummydata";
// import { ScrollArea } from "../../components/ui/scroll-area";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../../components/ui/tooltip"

// function PCB() {
//   let navigate = useNavigate();
//   const [dialogCount, setDialogCount] = useState(1);
//   const [dialogStates, setDialogStates] = useState(
//     Array.from({ length: 1 }, () => true)
//   );
//   const [processControlBlocks, setProcessControlBlocks] = useState([]);
//   const [dialogVisible, setDialogVisible] = useState(false); // State to manage dialog visibility

//   useEffect(() => {
//     const generateRandomProcess = () => {
//       const newProcess = generateRandomProcessControlBlock(
//         processControlBlocks.length
//           ? processControlBlocks[processControlBlocks.length - 1].id
//           : 0
//       );
//       setProcessControlBlocks((prevProcesses) => [
//         ...prevProcesses,
//         newProcess,
//       ]);
//     };

//     const interval = setInterval(generateRandomProcess, 3000);

//     return () => clearInterval(interval);
//   }, [processControlBlocks]);

//   const toggleDialog = () => {
//     setDialogVisible(!dialogVisible);
//   };

//   const renderDialogContent = () => {
//     return (
//       <Dialog open={dialogVisible} onDismiss={toggleDialog}>
//         <Draggable positionOffset={{ x: "-50%", y: "-50%" }}>
//           <DialogContent className="h-fit w-fit">
//             <div className="">
//               <DialogHeader>
//                 <DialogTitle className="text-s">
//                   Process Control Block
//                 </DialogTitle>
//                 <DialogClose asChild onClick={toggleDialog} />
//               </DialogHeader>
//             </div>
//             {/* For TABS, Scheduler and Virtual Memory */}
//             <Tabs defaultValue="Tabs" className="w-[400px]">
//               <TabsList>
//                 <TabsTrigger value="Scheduler">Scheduler</TabsTrigger>
//                 <TabsTrigger value="Virtual Memory">Virtual Memory</TabsTrigger>
//               </TabsList>
//               <TabsContent value="Scheduler">
//                 {/* Add content for Scheduler tab if needed */}
//               </TabsContent>
//               <TabsContent value="Virtual Memory">
//                 <VirtualMemory />
//               </TabsContent>
//             </Tabs>
//           </DialogContent>
//         </Draggable>
//       </Dialog>
//     );
//   };

//   return (
//     <TooltipProvider>
//       <Tooltip>
//         <TooltipTrigger asChild>
//           <Button
//             id="pcbButton"
//             variant="outline"
//             size="icon"
//             className={`${styles.appIconButton} transparent`}
//                   onClick = {() => navigate('/PCB')} >
          
//             <img src={pcbIcon} alt="pcb-icon" />
//           </Button>
//         </TooltipTrigger>
//         <TooltipContent>
//           BusyBee (PCB)
//         </TooltipContent>
//       </Tooltip>
//     </TooltipProvider>
//     // <TooltipProvider>
//     //   <Dialog>
//     //     <DialogTrigger asChild>
//     //       <div className="relative">
//     //         <Tooltip>
//     //           <TooltipTrigger asChild>
//     //             <Button 
//     //               id="pcbButton" 
//     //               variant="outline" 
//     //               icon="icon"
//     //               className={`${styles.appIconButton} transparent`}
//     //             >
//     //               <img src={pcbIcon} alt="pcb-icon"/>
//     //             </Button>
//     //           </TooltipTrigger>
//     //           <TooltipContent>
//     //             BuzzNote
//     //           </TooltipContent>
//     //         </Tooltip>
//     //       </div>
//     //     </DialogTrigger>
//     //     {renderDialogContent()}
//     //   </Dialog>
//     // </TooltipProvider>
//   );
// }

// export default PCB;


import styles from "./pcb.module.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Draggable from "react-draggable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Copy, FolderOpenDot, FolderOpen, Save, SaveAll } from "lucide-react";
import pcbIcon from "../../assets/img/bee.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import PCB2 from "../../pages/pcb"
import VirtualMemory from "./VirtualMemory";

function PCB() {
  let navigate = useNavigate();
  const [dialogCount, setDialogCount] = useState(1);
  const [dialogStates, setDialogStates] = useState(
    Array.from({ length: 1 }, () => true)
  );
  const [processControlBlocks, setProcessControlBlocks] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false); // State to manage dialog visibility


  const renderDialogContent = () => {
    const dialogContentArray = [];
    for (let i = 0; i < dialogCount; i++) {
      dialogContentArray.push(
        <>
          <Draggable positionOffset={{ x: '-50%', y: '-56%' }}>
            <DialogContent key={i} className="w-[98%] h-[86%] flex" style={{ position: 'fixed', top: '50', left: '50' }}>
              <div className="w-full">
                <DialogHeader>
                  <DialogTitle className="text-s">
                BusyBee (PCB)
                  </DialogTitle>
                </DialogHeader>
              {/* For TABS, Scheduler and Virtual Memory */}
              <Tabs defaultValue="Tabs" className="w-full">
                <TabsList>
                  <TabsTrigger value="Scheduler">Scheduler</TabsTrigger>
                  <TabsTrigger value="Virtual Memory">Virtual Memory</TabsTrigger>
                </TabsList>
                <TabsContent value="Scheduler">
                  {/* Add content for Scheduler tab if needed */}
                  <PCB2 />
                </TabsContent>
                <TabsContent value="Virtual Memory">
                  <VirtualMemory />
                </TabsContent>
              </Tabs>
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
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  id="pcbButton" 
                  variant="outline" 
                  icon="icon"
                  className={`${styles.appIconButton} transparent`}
                >
                  <img src={pcbIcon} alt="notepad-icon"/>
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
export default PCB;


