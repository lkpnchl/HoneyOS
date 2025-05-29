# PCB Components

This directory contains components for Process Control Block (PCB) simulation in the Neo Honey OS.

## Components

- **BusyBee (index.js)**: Main entry point for the PCB module, creates the dialog window
- **MemoryManagement**: Simulates memory management with best-fit allocation
- **MemorySimulator (script.js)**: Simulates memory allocation and deallocation for processes
- **VirtualMemory**: Simulates page replacement algorithms for virtual memory

## Directory Structure

```
pcb/
├── assets/           # Static assets (images, etc.)
│   └── bees.gif      
├── component/        # UI Components
│   ├── header.jsx    # Header component for PCB
│   ├── list.jsx      # List component for algorithms
│   ├── table.jsx     # Table component for results
│   └── tables.jsx    # Tables wrapper component
├── algorithms.js     # Page replacement algorithms
├── components.js     # Export file for easy importing
├── index.js          # Main entry point (BusyBee component)
├── MemoryManagement.js      # Memory management simulation
├── MemoryManagement.module.css # Styles for memory management
├── pcb.module.css    # Shared styles
├── randomRefStringGen.js    # Reference string generator
├── README.md         # This documentation
├── script.js         # Memory simulator (renamed from legacy code)
└── VirtualMemory.js  # Virtual memory simulation
```

## Usage

Import components from the `components.js` file:

```jsx
import { 
  BusyBee, 
  MemoryManagement, 
  MemorySimulator, 
  VirtualMemory 
} from '../components/pcb/components';

// Use in your app
function App() {
  return (
    <div>
      <BusyBee />
      {/* Or other components as needed */}
    </div>
  );
}
```

## Memory Management Simulation

The memory management components simulate various aspects of operating system memory management:

1. **Process Allocation**: Processes are created with memory size and execution time
2. **Memory Blocks**: Memory is visualized with available and allocated blocks
3. **Best-Fit Algorithm**: Uses best-fit allocation strategy to assign processes to memory blocks

## Virtual Memory Simulation

The virtual memory component simulates page replacement algorithms:

1. **First In First Out (FIFO)**: Pages are replaced in the order they were brought into memory
2. **Reference String**: Customizable reference string to simulate memory accesses
3. **Frame Number**: Configurable number of frames available in memory 