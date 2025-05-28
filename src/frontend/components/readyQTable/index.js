import React, { useState, useEffect } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeader,
} from "../../components/ui/table";
import styles from "./pcb.module.css";
import { ScrollArea } from "../../components/ui/scroll-area";

function ReadyQTable({ simulation, selectedAlgo }) {
    return(
       
       <Table className="w-full h-full" style={{ maxHeight: '88%' }}> 
  <ScrollArea className="h-[15rem] w-auto p-2">
    <TableHeader className="sticky z-50 top-0 bg-[#FEF8D8] drop-shadow-sm">
      <TableRow className="font-bold h-4">
        <TableHead className="text-center text-slate-950 font-bold w-1/6">Process ID</TableHead>
        <TableHead className="text-center text-slate-950 font-bold w-1/8">Burst</TableHead>
        <TableHead className="text-center text-slate-950 font-bold w-1/8">Arrival</TableHead>
        <TableHead className="text-center text-slate-950 font-bold w-1/6">Size</TableHead>
             {selectedAlgo === "p" ? (   
                <TableCell className="text-center text-slate-950 font-bold w-1/8">Priority</TableCell> 
                ): 
                null}
        <TableHead className="text-center text-slate-950 font-bold w-1/6">Status</TableHead>
        <TableHead className="text-center text-slate-950 font-bold w-[2%]">Remaining</TableHead>
        <TableHead className="text-center text-slate-950 font-bold w-[25px]">%</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {simulation?.jobs
        .filter(item => item.status === "Ready" || item.status === "Running")
        .map((item, index) => (
          <TableRow key={index} className={item.status === "Running" ? "sticky z-49 top-[35.5px] font-bold text-amber-950 bg-yellow-300 rowTb" : "rowTb"}>
            <TableCell className="text-center text-white">{item.id}</TableCell>
            <TableCell className="text-center text-white">{item.burst}</TableCell>
            <TableCell className="text-center text-white">{item.arrivalTime}</TableCell>
            <TableCell className="text-center text-white">{item.memory} MB</TableCell>
            {selectedAlgo === "p" ? (   
                <TableCell className="text-center text-white font-bold w-1/8">{item.priority}</TableCell> 
                ): 
                null}
            <TableCell className="text-center text-white">{item.status}</TableCell> {/* New, Ready, Running, Waiting, Suspended, Terminated */}
            <TableCell className="text-center text-white">{item.remaining}</TableCell>
            <TableCell className="text-center text-white">{item.percent}</TableCell>
          </TableRow>
        ))}
    </TableBody>
  </ScrollArea>
</Table>

    )
}

export default ReadyQTable;