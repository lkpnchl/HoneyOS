import React, { useState, useEffect, useCallback } from "react";
import styles from "./MemoryManagement.module.css";

// Constants
const MEM_CONTROL_BLOCK_SIZE = 16;

// Helper classes
class Process {
  constructor(size, time, id) {
    this.size = size;
    this.timeLeft = time;
    this.allocatedBlock = null;
    this.id = id;
  }

  isAllocated() {
    return this.allocatedBlock != null;
  }

  tick() {
    this.timeLeft -= 1;
  }
}

class MemControlBlock {
  constructor(size) {
    this.size = size;
    this.process = null;
    this.available = true;
    this.next = null;
    this.prev = null;
    this.fromPartition = false;
  }

  setProcess(process) {
    if (process == null) {
      this.process = null;
      this.available = true;
    } else {
      this.process = process;
      this.available = false;
    }
  }
}

class Heap {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  requestAllocation(process) {
    let blockBestFit = this.head;

    // Make sure our initial best block is valid
    while (blockBestFit && (blockBestFit.size < process.size || !blockBestFit.available)) {
      blockBestFit = blockBestFit.next;
      if (blockBestFit == null) {
        return false;
      }
    }

    // See if there's an even better block
    let block = blockBestFit.next;
    while (block != null) {
      if (
        block.size >= process.size &&
        block.available &&
        block.size < blockBestFit.size
      ) {
        blockBestFit = block;
      }
      block = block.next;
    }

    const spaceLeftover =
      blockBestFit.size - (process.size + MEM_CONTROL_BLOCK_SIZE);

    // Partition block if needed
    if (spaceLeftover > 0) {
      const newBlock = new MemControlBlock(spaceLeftover);

      const nextBlock = blockBestFit.next;
      if (nextBlock != null) {
        nextBlock.prev = newBlock;
        newBlock.next = nextBlock;
      }

      blockBestFit.next = newBlock;
      newBlock.prev = blockBestFit;

      blockBestFit.size = process.size;

      newBlock.fromPartition = true;
    }

    blockBestFit.setProcess(process);
    process.allocatedBlock = blockBestFit;
    return true;
  }

  deallocateProcess(process) {
    const block = process.allocatedBlock;
    block.setProcess(null);
    process.allocatedBlock = null;
    this.mergeFreeBlocks(block);
  }

  mergeFreeBlocks(block) {
    if (block.prev && block.prev.available) {
      block.prev.size += block.size + MEM_CONTROL_BLOCK_SIZE;
      block.prev.next = block.next;
      if (block.next) {
        block.next.prev = block.prev;
      }
      block = block.prev;
    }

    if (block.next && block.next.available) {
      block.size += block.next.size + MEM_CONTROL_BLOCK_SIZE;
      block.next = block.next.next;
      if (block.next) {
        block.next.prev = block;
      }
    }
  }

  add(block) {
    if (this.head == null) {
      this.head = block;
    } else {
      block.next = this.head;
      this.head.prev = block;
      this.head = block;
    }

    this.size += block.size;
  }
}

const MemoryManagement = ({ simulation }) => {
  const [processes, setProcesses] = useState([]);
  const [heap, setHeap] = useState(null);
  const [processID, setProcessID] = useState(0);
  const [memoryBlocks, setMemoryBlocks] = useState([]);

  // Initialize heap
  useEffect(() => {
    console.log('Simulation data:', simulation);
    
    const newHeap = new Heap();
    const blockSizes = [50]; // Default block size
    
    for (let i = 0; i < blockSizes.length; i++) {
      newHeap.add(new MemControlBlock(blockSizes[i]));
    }
    
    setHeap(newHeap);
    
    // Initialize processes from simulation data if available
    if (simulation?.jobs?.length > 0) {
      const initialProcesses = simulation.jobs.map(
        (p, idx) => new Process(p.memory, p.remaining, idx)
      );
      setProcesses(initialProcesses);
      setProcessID(initialProcesses.length);
    }
  }, [simulation]);

  // Memory block visualization
  const renderMemoryBlocks = useCallback(() => {
    if (!heap) return [];
    
    const blocks = [];
    let block = heap.head;
    let position = 0;
    
    while (block != null) {
      const height = (block.size / heap.size) * 100;
      const adjustedHeight = block.fromPartition ? 
        height + (MEM_CONTROL_BLOCK_SIZE / heap.size) * 100 : height;
      
      blocks.push({
        id: position,
        height: adjustedHeight,
        size: block.size,
        available: block.available,
        process: block.process ? block.process.id : null
      });
      
      position++;
      block = block.next;
    }
    
    setMemoryBlocks(blocks);
    return blocks;
  }, [heap]);

  // Process memory allocation and deallocation
  useEffect(() => {
    if (!heap || processes.length === 0) return;
    
    const intervalId = setInterval(() => {
      // Create a copy of processes to work with
      const updatedProcesses = [...processes];
      let hasChanges = false;
      
      for (let i = 0; i < updatedProcesses.length; i++) {
        const process = updatedProcesses[i];
        
        if (!process.isAllocated()) {
          if (heap.requestAllocation(process)) {
            hasChanges = true;
          }
        } else {
          process.tick();
          if (process.timeLeft < 1) {
            heap.deallocateProcess(process);
            updatedProcesses.splice(i, 1);
            i--;
            hasChanges = true;
          }
        }
      }
      
      if (hasChanges) {
        setProcesses([...updatedProcesses]);
        renderMemoryBlocks();
      }
    }, 1000);
    
    return () => clearInterval(intervalId);
  }, [heap, processes, renderMemoryBlocks]);

  // Add a new process
  const addProcess = (size, time) => {
    const newProcess = new Process(size, time, processID);
    setProcessID(prevId => prevId + 1);
    setProcesses([...processes, newProcess]);
  };

  return (
    <div className={styles.container}>
      <div className={styles.memoryBlocks}>
        {memoryBlocks.map((block) => (
          <div 
            key={block.id}
            className={`${styles.block} ${block.available ? styles.available : styles.unavailable}`}
            style={{ height: `${block.height}%` }}
          >
            <div className={styles.blockLabel}>
              {block.size}K
              {!block.available && block.process !== null && 
                <span className={styles.processId}>P{block.process}</span>
              }
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.processTable}>
        <h3>Processes</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Size</th>
              <th>Time Left</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((process) => (
              <tr key={process.id}>
                <td>{process.id}</td>
                <td>{process.size}K</td>
                <td>{process.timeLeft}</td>
                <td>{process.isAllocated() ? 'Allocated' : 'Waiting'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className={styles.controls}>
        <h3>Add Process</h3>
        <form onSubmit={(e) => {
          e.preventDefault();
          const size = parseInt(e.target.elements.processSize.value);
          const time = parseInt(e.target.elements.processTime.value);
          if (size > 0 && time > 0) {
            addProcess(size, time);
            e.target.reset();
          }
        }}>
          <div className={styles.formGroup}>
            <label>Size (KB):</label>
            <input 
              type="number" 
              name="processSize" 
              min="1" 
              max={heap?.size || 50}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label>Time (seconds):</label>
            <input 
              type="number" 
              name="processTime" 
              min="1" 
              required 
            />
          </div>
          <button type="submit">Add Process</button>
        </form>
      </div>
    </div>
  );
};

export default MemoryManagement;
