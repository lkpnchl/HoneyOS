import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "../../components/ui/table";
import { ScrollArea } from "../../components/ui/scroll-area";

function JobPoolTable({ simulation, selectedAlgo }) {
    return(
        <>
            {selectedAlgo !== "p" ? (    
                <Table className="w-full h-full"> 
                    <ScrollArea className="h-[15rem] w-auto p-2">
                    <TableHeader className="sticky z-50 top-0 bg-[#FEF8D8] drop-shadow-sm">
                    <TableRow>
                            <TableHead className="text-center text-slate-950 font-bold w-1/7 ">Process ID</TableHead>
                            <TableHead className="text-center text-slate-950 font-bold w-1/7 ">Burst</TableHead>
                            <TableHead className="text-center text-slate-950 font-bold w-1/7 ">Arrival</TableHead>
                            <TableHead className="text-center text-slate-950 font-bold w-1/7 ">Size</TableHead>
                            <TableHead className="text-center text-slate-950 font-bold w-44">Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {([...(simulation?.jobs || [])]
                            .sort((a, b) => {
                            if (a === simulation.currentJob) return -1;
                            if (b === simulation.currentJob) return 1;
                            if (selectedAlgo === "sjf") {
                                return a.burst - b.burst; // Sort by burst for Shortest Job First (sjf)
                            } else if (selectedAlgo === "fcfs") {
                                return a.arrivalTime - b.arrivalTime; // Sort by arrival time for First-Come, First-Served (fcfs)
                            } else {
                                return a.id - b.id; // Default sorting by ID
                            }
                            })
                        .filter(item => item.status === "Waiting" || item.status === "Waiting For Memory" || item.status === "New")
                        .map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.burst}</TableCell>
                                <TableCell>{item.arrivalTime}</TableCell>
                                <TableCell>{item.memory} MB</TableCell>
                                <TableCell>{item.status}</TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                    </ScrollArea>
            </Table>
            ) : (
                <Table className="w-full h-full"> 
                    <ScrollArea className="h-[15rem] w-auto p-2">
                    <TableHeader className="sticky z-50 top-0 bg-[#FEF8D8] drop-shadow-sm">
                    <TableRow>
                            <TableHead className="text-center text-slate-950 font-bold w-1/7">Process ID</TableHead>
                            <TableHead className="text-center text-slate-950 font-bold w-1/7">Burst</TableHead>
                            <TableHead className="text-center text-slate-950 font-bold w-1/7">Arrival</TableHead>
                            <TableHead className="text-center text-slate-950 font-bold w-1/7">Size</TableHead>
                            <TableHead className="text-center text-slate-950 font-bold w-1/7">{selectedAlgo === 'p' && "Priority"}</TableHead>
                            <TableHead className="text-center text-slate-950 font-bold w-44">Status</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {([...(simulation?.jobs || [])] 
                            .sort((a, b) => {
                            if (a === simulation.currentJob) return -1;
                            if (b === simulation.currentJob) return 1;
                            return (a.priority || 0) - (b.priority || 0) || b.priority - a.priorit;
                            })
                        .filter(item => item.status === "Waiting" || item.status === "Waiting For Memory" || item.status === "New")
                        .map((item, index) => (
                            <TableRow key={index}>
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.burst}</TableCell>
                                <TableCell>{item.arrivalTime}</TableCell>
                                <TableCell>{item.memory} MB</TableCell>
                                <TableCell>{selectedAlgo === 'p' && item.priority}</TableCell>
                                <TableCell>{item.status}</TableCell>
                            </TableRow>
                        )))}
                    </TableBody>
                    </ScrollArea>
            </Table>
            )}
        </>
    )
}

export default JobPoolTable;