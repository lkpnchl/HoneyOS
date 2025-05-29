import React, { useState, useEffect, useRef } from 'react';
import styles from './pcb.module.css';

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
			if (block.size >= process.size && block.available && block.size < blockBestFit.size) {
				blockBestFit = block;
			}
			block = block.next;
		}

		const spaceLeftover = blockBestFit.size - (process.size + 16); // memControlBlockSize = 16

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
		process.allocatedBlock.setProcess(null);
		process.allocatedBlock = null;
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

const MemorySimulator = () => {
	const [processes, setProcesses] = useState([]);
	const [processID, setProcessID] = useState(0);
	const [logs, setLogs] = useState(['DEBUG LOG']);
	const [memoryBlocks, setMemoryBlocks] = useState([]);
	const heapRef = useRef(null);
	const memoryDivRef = useRef(null);

	useEffect(() => {
		// Initialize heap
		const heap = new Heap();
		const blockSizes = [256, 256, 256, 256];
		
		for (let i = 0; i < blockSizes.length; i++) {
			heap.add(new MemControlBlock(blockSizes[i]));
		}
		
		heapRef.current = heap;
		repaintMemory();
		
		// Start clock
		const clockInterval = setInterval(() => {
			updateProcesses();
		}, 1000);
		
		return () => clearInterval(clockInterval);
	}, []);

	const addLog = (message) => {
		setLogs(prevLogs => [...prevLogs, message]);
	};

	const repaintMemory = () => {
		if (!heapRef.current || !memoryDivRef.current) return;
		
		const heap = heapRef.current;
		const memoryBlocks = [];
		let block = heap.head;
		
		while (block != null) {
			const height = (block.size / heap.size) * 100;
			const adjustedHeight = block.fromPartition ? height + (16 / heap.size) * 100 : height;
			
			memoryBlocks.push({
				size: block.size,
				height: adjustedHeight,
				available: block.available,
				process: block.process ? block.process.id : null
			});
			
			block = block.next;
		}
		
		setMemoryBlocks(memoryBlocks);
	};

	const updateProcesses = () => {
		if (!heapRef.current) return;
		
		const heap = heapRef.current;
		const updatedProcesses = [...processes];
		let hasChanges = false;
		
		for (let i = 0; i < updatedProcesses.length; i++) {
			const process = updatedProcesses[i];
			
			if (!process.isAllocated()) {
				if (heap.requestAllocation(process)) {
					addLog(`Process ${process.id} allocated ${process.size}K`);
					hasChanges = true;
				}
			} else {
				process.tick();
				if (process.timeLeft < 1) {
					addLog(`Process ${process.id} completed`);
					heap.deallocateProcess(process);
					updatedProcesses.splice(i, 1);
					i--;
					hasChanges = true;
				}
			}
		}
		
		if (hasChanges) {
			setProcesses([...updatedProcesses]);
			repaintMemory();
		}
	};

	const handleProcessSubmit = (e) => {
		e.preventDefault();
		const processSize = parseInt(e.target.elements.processSize.value);
		const processTime = parseInt(e.target.elements.processTime.value);
		
		if (processSize > 0 && processTime > 0) {
			const newProcess = new Process(processSize, processTime, processID);
			
			setProcesses(prevProcesses => [...prevProcesses, newProcess]);
			setProcessID(prevId => prevId + 1);
			
			addLog(`Requesting: ${processSize}K`);
			
			e.target.elements.processSize.value = '';
			e.target.elements.processTime.value = '';
		}
	};

	return (
		<div className={styles.memoryContainer}>
			<div className={styles.memorySimulator}>
				<div className={styles.memoryVisualization} ref={memoryDivRef}>
					{memoryBlocks.map((block, index) => (
						<div 
							key={index}
							className={`${styles.memoryBlock} ${block.available ? styles.available : styles.unavailable}`}
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
				
				<div className={styles.processInfo}>
					<div className={styles.processForm}>
						<h3>Add Process</h3>
						<form id="processForm" onSubmit={handleProcessSubmit}>
							<div className={styles.formGroup}>
								<label htmlFor="processSize">Size (KB):</label>
								<input 
									type="number" 
									id="processSize" 
									name="processSize" 
									placeholder="Process size" 
									min="1" 
									required 
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="processTime">Time (seconds):</label>
								<input 
									type="number" 
									id="processTime" 
									name="processTime" 
									placeholder="Process time"
									min="1"
									required 
								/>
							</div>
							<button type="submit">Add Process</button>
						</form>
					</div>
					
					<div className={styles.processTable}>
						<h3>Current Processes</h3>
						<table>
							<thead>
								<tr>
									<th>ID</th>
									<th>Size</th>
									<th>Time Left</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody id="processTable">
								{processes.map(process => (
									<tr key={process.id} id={`process${process.id}`}>
										<td>{process.id}</td>
										<td>{process.size}K</td>
										<td id={`process${process.id}timeLeft`}>{process.timeLeft}</td>
										<td>{process.isAllocated() ? 'Allocated' : 'Waiting'}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			
			<div className={styles.logBox}>
				<h3>Logs</h3>
				<div id="logBox">
					{logs.map((log, index) => (
						<div key={index}>{log}</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default MemorySimulator;
