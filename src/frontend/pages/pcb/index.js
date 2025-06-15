import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Cross2Icon, StopIcon, ReloadIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { Button } from "../../components/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../../components/ui/toggle-group"
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Card, CardHeader, CardContent, CardBody, CardFooter } from "../../components/ui/card";
import JobPoolTable from '../../components/jobPoolTable';
import ReadyQTable from '../../components/readyQTable';
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { FirstComeFirstServe, ShortestJobFirst, Priority, PreemptivePriority, STRF, RoundRobin } from '../../../backend/algorithm';
import { Job } from '../../../backend/job';
import { Simulation } from '../../../backend/simulation';
import {ReactComponent as PlayIcon} from '../../assets/img/play-fill.svg'
import {ReactComponent as PausePlayIcon} from '../../assets/img/play-pause.svg'
// import './styles.css'
import './styles.scss'
import MemoryManagement from "../../components/memory";

// PCB component simulates a CPU scheduling simulation using various algorithms
function PCB() {
    const navigate = useNavigate();  // Hook to navigate programmatically
    const [title, setTitle] = useState('CPU-Scheduling-Simulator');  // State for the title
    const [simulation, setSimulation] = useState(null);  // State for the simulation object
    const [jobs, setJobs] = useState([]);  // State for the list of jobs
    const [simSpeed, setSimSpeed] = useState(400);  // State for the simulation speed
    const [quantum, setQuantum] = useState(4);  // State for the quantum time (used in Round Robin)
    const [jobCount, setJobCount] = useState(0);  // State for the number of jobs
    const [algo, setAlgo] = useState('fcfs');  // State for the selected algorithm
    const [selectedAlgo, setSelectedAlgo] = useState(false);  // State for the selected algorithm
    const [running, setRunning] = useState(false);  // State to determine if the simulation is running
    const [started, setStarted] = useState(false); // simulation started
    const [paused, setPaused] = useState(false); // simulation paused
    const [usePredefined, setUsePredefined] = useState(true); // use predefined jobs instead of random ones
    const intervalRef = useRef(null);  // Ref for the simulation interval
    const memorySize = 1024;  // Total memory size for the memory manager
    // useEffect to manage the simulation timer when the running state or simSpeed changes
    useEffect(() => {
        if (running) {
            setTimer(simSpeed);
        } else {
            setTimer(0);
        }
        return () => clearInterval(intervalRef.current); // Cleanup on unmount
    }, [running, simSpeed, simulation]);

    // Function to set the timer interval for the simulation steps
    const setTimer = (time) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (time === 0) return;
        intervalRef.current = setInterval(() => {
        if (simulation.isFinished()) {
             clearInterval(intervalRef.current);
            setRunning(false);
        }
        simulation.nextStep();
        setJobs([...simulation.jobs]);
        }, time);
    };

    // Function to get the selected scheduling algorithm
    const getAlgorithm = (selectedAlgo) => {
        let algorithm;
        switch (selectedAlgo) {
            case 'fcfs':
                algorithm = new FirstComeFirstServe();
                break;
            case 'sjf':
                algorithm = new STRF();
                break;
            case 'p':
                algorithm = new Priority();
                break;
            case 'rr':
                algorithm = new RoundRobin();
                algorithm.quantumTime = Number(quantum); // Ensure quantum time is set
                break;
            default:
                algorithm = new FirstComeFirstServe();
        }
        return algorithm;
    };

    // Function to create a new simulation
    const newSim = (selectedAlgo) => {
        console.log("newSim")
        let newJobs = [];
        
        if (!usePredefined) {
            // Create random jobs if not using predefined
            for (let i = 0; i < Number(1); i++) {
                newJobs.push(Job.createRandomJob(i + 1));
            }
        }
        
        setJobs(newJobs);
        const algorithm = getAlgorithm(selectedAlgo); // Pass the selected algorithm
        algorithm.quantumTime = Number(quantum);
        
        // Create simulation with predefined jobs flag
        const sim = new Simulation(algorithm, newJobs, memorySize, usePredefined);
        sim.reset();
        setSimulation(sim);
    };

    // Function to toggle between predefined and random jobs
    const toggleJobType = () => {
        setUsePredefined(!usePredefined);
    };

    // Function to start the simulation
    const play = (selectedAlgo) => {
        setSelectedAlgo(true);
        setStarted(true);
        if (!running) {
            newSim(selectedAlgo);
            setRunning(true);
            console.log(algo)
        }
        console.log(started)
        console.log("isitsaktrue:", selectedAlgo)
    };

    const stop = () => {
        setRunning(false);
    };

    const pause = () => {
        setRunning(false);
        setPaused(true);
    };

    const resume = () => {
        setRunning(true);
    };

    // Function to reset the simulation
    const reset = () => {
        stop();
        setPaused(false);
        setStarted(false);
        simulation.reset();
        setSimulation(null);
        setJobCount(0);
        setSelectedAlgo(false);
        setRunning(false);
        setJobs([]);
        console.log(started)
    }; 
    
  // Function to finish the simulation by processing all remaining jobs
  const finish = () => {
    if (simulation) {
      simulation.finish();
      setJobs([...simulation.jobs]);
      stop()
    setPaused(false);
    setStarted(false);
    setSelectedAlgo(false);
    setRunning(false);
    }
  };

    const [yieeeRR, setYieeeRR] = useState(false);

    const handleAlgoChange = (event) => {
        const newValue = event.target.value;
        setAlgo(newValue);
        if (newValue === 'rr') {
            setYieeeRR(true);
        } else {
            setYieeeRR(false);
        }
    }
    
    
    const handleInputChange = (event) => {
        const value = event.target.value;
        setQuantum(value);
    };
    const scrollAreaRef = useRef(null);

    useEffect(() => {
        const scrollArea = scrollAreaRef.current;
        if (scrollArea) {
            // Scroll to the rightmost position
            scrollArea.scrollLeft = scrollArea.scrollWidth;
        }
    }, [simulation]);


    // Create a ref for the container
    const containerRef = useRef(null);
    // Create a ref for the last item
    const lastItemRef = useRef(null);

    // Add useEffect hook to handle auto-scrolling when new items are added
    useEffect(() => {
        if (lastItemRef.current) {
            // Scroll the last item into view
            lastItemRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [simulation?.ganttChart.length]);

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const formattedHrs = String(hrs).padStart(2, '0');
        const formattedMins = String(mins).padStart(2, '0');
        const formattedSecs = String(secs).padStart(2, '0');

        return `${formattedHrs}:${formattedMins}:${formattedSecs}`;
    }


    return (
        <>
        <div className="">
        <div className="mt-6 border-2 border-amber-500 grid grid-cols-6 grid-rows-8 relative flex bg-orange-50 h-[650px] w-full p-5 justify-center items-center text-center rounded-lg gap-4 box-shadow-lg">    
        
            {/* Scheduling Policy Card */}
            <div className="row-span-12 h-full gap-4" >
                <Card className="bg-yellow-100/50 justify-center item-center h-full mb-4">
                    <CardHeader className="bg-amber-400 text-slate-950 h-[20px] justify-center items-center rounded-t">
                        <h6>Policy</h6>
                    </CardHeader>
                    <CardContent className="justify-center items-center h-[580px] space-y-2 px-3 pt-2 overflow-y-auto">
                        <div className="w-full flex flex-col">
                            <span className="text-xs font-medium text-left mb-1 text-slate-800">Algorithm:</span>
                            <div className="flex justify-between items-center w-full">
                                <ToggleGroup
                                    type="single"
                                    className="grid cursor-none grid-cols-1 gap-1.5 w-full"
                                    value={algo}
                                    onChange={handleAlgoChange}
                                    aria-label="Choose Algorithm"
                                >
                                    <ToggleGroupItem
                                        className="border-2 cursor-none bg-white data-[state=on]:bg-yellow-300 hover:bg-yellow-100/50"
                                        value="fcfs"
                                        aria-label="Toggle fcfs"
                                        disabled={selectedAlgo}
                                        running={selectedAlgo}
                                        onClick={handleAlgoChange}
                                    >
                                        <Button variant="link" value="fcfs" className="w-full h-full text-sm py-1 px-0">
                                            First Come, First Serve
                                        </Button>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        className="border-2 cursor-none bg-white data-[state=on]:bg-yellow-300 hover:bg-yellow-100/50"
                                        value="sjf"
                                        aria-label="Toggle sjf"
                                        disabled={selectedAlgo}
                                        running={selectedAlgo}
                                        onClick={handleAlgoChange}
                                    >
                                        <Button variant="link" value="sjf" className="w-full h-full text-sm py-1 px-0">
                                            Shortest Job First
                                        </Button>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        className="border-2 bg-white data-[state=on]:bg-yellow-300 hover:bg-yellow-100/50"
                                        value="p"
                                        aria-label="Toggle p"
                                        disabled={selectedAlgo}
                                        running={selectedAlgo}
                                        onClick={handleAlgoChange}
                                    >
                                        <Button variant="link" value="p" className="w-full h-full text-sm py-1 px-0">
                                            Priority Scheduling
                                        </Button>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        className="border-2 bg-white data-[state=on]:bg-yellow-300"
                                        value="rr"
                                        aria-label="Toggle rr"
                                        disabled={selectedAlgo}
                                        running={selectedAlgo}
                                        onClick={handleAlgoChange}
                                    >
                                        <Button variant="link" value="rr" className="w-full h-full text-sm py-1 px-0">
                                            Round Robin
                                        </Button>
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                        </div>
                        
                        <div className="flex flex-col items-center w-full">
                            <div className="p-2 rounded-lg w-full">
                                <div className="flex flex-col">
                                    <div className="flex rounded-md overflow-hidden w-full" style={{ backgroundColor: '#FFF8E1' }}>
                                        <button 
                                            className={`flex-1 py-1 px-3 text-center font-medium transition-all truncate ${
                                                usePredefined 
                                                ? "bg-amber-500 text-white" 
                                                : "bg-transparent text-amber-800"
                                            }`}
                                            onClick={toggleJobType}
                                            disabled={selectedAlgo}
                                            style={{ fontSize: '15px' }}
                                        >
                                            Predefined
                                        </button>
                                        <button 
                                            className={`flex-1 py-1 px-3 text-center font-medium transition-all truncate ${
                                                !usePredefined 
                                                ? "bg-amber-500 text-white" 
                                                : "bg-transparent text-amber-800"
                                            }`}
                                            onClick={toggleJobType}
                                            disabled={selectedAlgo}
                                            style={{ fontSize: '15px' }}
                                        >
                                            Random
                                        </button>
                                    </div>
                                    
                                    <div className="flex justify-center mt-1">
                                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <g transform="translate(4, 4)">
                                                <ellipse fill="#FFC107" cx="8" cy="8" rx="6" ry="5"/>
                                                <path fill="#795548" d="M3,5.5 L1.5,2.5 L3,3 L5,1.5 L6,3 L7.5,2 L8,0 L8.5,2 L10,3 L11,1.5 L13,2.5 L11,5.5 C11,5.5 9.5,9 8,9 C6.5,9 3,5.5 3,5.5 Z"/>
                                                <path fill="#795548" d="M13,10.5 L14.5,13.5 L13,13 L11,14.5 L10,13 L8.5,14 L8,16 L7.5,14 L6,13 L5,14.5 L3,13.5 L5,10.5 C5,10.5 6.5,7 8,7 C9.5,7 13,10.5 13,10.5 Z"/>
                                                <circle fill="#212121" cx="6" cy="7.5" r="0.75"/>
                                                <circle fill="#212121" cx="10" cy="7.5" r="0.75"/>
                                                <path fill="transparent" stroke="#795548" strokeWidth="0.5" d="M6.5,9.5 C6.5,10 7.2,10.5 8,10.5 C8.8,10.5 9.5,10 9.5,9.5"/>
                                            </g>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {yieeeRR === true ? (
                        <div className="flex flex-col items-center justify-center w-full">
                            <div className="border-2 p-2 rounded-lg w-full bg-white shadow-sm">
                                <div className="flex flex-col space-y-1">
                                    <span className="text-sm font-medium text-slate-800">Quantum Time:</span>
                                    
                                    {started === false ? (
                                        <div className="flex items-center">
                                            <Input 
                                                value={quantum} 
                                                onChange={handleInputChange} 
                                                className="border-2 border-amber-400 bg-white h-8 text-base font-bold text-center rounded-md focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                                                type="number"
                                                min="1"
                                                max="20" 
                                            />
                                            <div className="ml-2 text-xs text-slate-500">
                                                <p className="font-medium text-[10px]">Time slice for process</p>
                                                <p className="text-[10px]">Higher values favor longer jobs</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center bg-amber-100 py-2 rounded-md">
                                            <p><b className="text-xl text-amber-800">{quantum}</b></p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        ) : (
                            <div className="border-2 p-2 rounded-lg w-full bg-white shadow-sm opacity-70">
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-slate-500">Quantum Time:</span>
                                    <div className="bg-slate-100 rounded-md p-1 text-center">
                                        <p className="text-slate-500 text-xs">Not applicable for current algorithm</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex flex-col items-center w-full">
                            <div className="w-full space-y-1.5">
                                <Button
                                    variant="nohover"
                                    className={`w-full h-9 flex items-center justify-center gap-1 ${
                                        running || paused 
                                        ? "bg-gray-300 text-gray-600" 
                                        : "bg-green-500 hover:bg-green-600 text-white shadow-sm"
                                    }`}
                                    onClick={() => {
                                        setSelectedAlgo(true);
                                        play(algo);
                                    }}
                                    disabled={running || paused}
                                >
                                    <PlayIcon className="h-3.5 w-3.5" />
                                    <span className="font-medium text-xs">Start Simulation</span>
                                </Button>
                                
                                <div className="grid grid-cols-2 gap-1.5">
                                    {running !== true ? (
                                        <Button
                                            variant="nohover"
                                            className={`h-8 flex items-center justify-center gap-1 ${
                                                !started 
                                                ? "bg-gray-300 text-gray-600" 
                                                : "bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                                            }`}
                                            onClick={resume}
                                            disabled={!started}
                                        >
                                            <PausePlayIcon className="h-3 w-3" />
                                            <span className="font-medium text-[10px]">Resume</span>
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="nohover"
                                            className="h-8 flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                                            onClick={pause}
                                            disabled={!started}
                                        >
                                            <PausePlayIcon className="h-3 w-3" />
                                            <span className="font-medium text-[10px]">Pause</span>
                                        </Button>
                                    )}
                                    
                                    <Button
                                        variant="nohover"
                                        className={`h-8 flex items-center justify-center gap-1 ${
                                            !started 
                                            ? "bg-gray-300 text-gray-600" 
                                            : "bg-red-500 hover:bg-red-600 text-white shadow-sm"
                                        }`}
                                        onClick={finish}
                                        disabled={!started}
                                    >
                                        <StopIcon className="h-3 w-3" />
                                        <span className="font-medium text-[10px]">Complete & Stop</span>
                                    </Button>
                                </div>
                                
                                <Button
                                    variant="nohover"
                                    className={`h-8 flex items-center justify-center gap-1 ${
                                        !started 
                                        ? "bg-gray-300 text-gray-600" 
                                        : "bg-lime-500 hover:bg-lime-600 text-white shadow-sm"
                                    }`}
                                    onClick={reset}
                                    disabled={!started}
                                >
                                    <ReloadIcon className="h-3 w-3" />
                                    <span className="font-medium text-[10px]">Reset Simulation</span>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Job Pool Card */}
            <div className="row-span-4 overflow-hidden col-start-2 col-span-3 row-start-1 h-full">
                <Card className="bg-yellow-100/50 h-full">
                    <CardHeader className="bg-amber-400 text-slate-950 h-[20px] justify-center items-center rounded-t">
                        <h6>Job Queue</h6></CardHeader>
                    <CardContent className="m-0">
                        <JobPoolTable simulation={simulation} selectedAlgo={algo} jobs={[]} />
                    </CardContent>
                </Card>
            </div>

            {/* Ready Queue Card */}
            <div className="row-span-8 col-start-2 col-span-3 row-start-5 h-full">
                <Card className="bg-yellow-100/50  h-full">
                    <CardHeader className="bg-amber-400 text-slate-950  h-[20px] justify-center items-center rounded-t">
                        <h6>Ready Queue</h6>
                    </CardHeader>
                    <CardContent className="grid grid-rows-5 grid-cols-1 h-full">
                        <div className="row-span-4 overflow-hidden border-b border-gray-300" style={{ maxHeight: '88%' }}>
                            <div className="h-full">
                                <ReadyQTable simulation={simulation} selectedAlgo={algo}/>
                            </div>
                        </div>
                        <div className="row-span-1 flex justify-start items-center px-2 pb-1" style={{ maxHeight: '12%' }}>
                            <ChevronRightIcon className="h-[20px] w-[20px]" />
                            <ScrollArea className="overflow-x-auto whitespace-nowrap w-full">
                                <div ref={containerRef} style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                                    {simulation?.ganttChart.map((item, index) => (
                                        <div
                                            key={index}
                                            className={`rounded-md gantt-thicc-${item} flex-start`}
                                            ref={index === simulation.ganttChart.length - 1 ? lastItemRef : null}
                                        >
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Memory Card */}
            <div className="row-span-12 col-start-5 row-start-1 h-full">
                <Card className="bg-yellow-100/50 h-full mb-4">
                    <CardHeader className="bg-amber-400 text-slate-950  h-[20px] justify-center items-center rounded-t">
                        <h6>Memory</h6>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-center items-center h-full px-4">
                        <MemoryManagement simulation={simulation}/>
                    </CardContent>
                </Card>
            </div>

            {/* CPU Card */}
            <div className="row-span-12 col-start-6 row-start-1 col-span-1 h-full">
                <Card className="bg-yellow-100/50  h-full">
                    <CardHeader className="bg-amber-400 text-slate-950  h-[20px] justify-center items-center rounded-t">
                        <h6> CPU </h6>
                    </CardHeader>
                    <CardContent className="justify-center items-center align-middle pt-4  px-4 gap-4 grid grid-rows py-10 gap-8 text-slate-950">
                        
                        <div className="circular-progress-container">
                        <svg className="circular-progresss px-6" viewBox="0 0 36 36">
                            <path
                            className="circle-bg"
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                            className="circle"
                            strokeDasharray={`${simulation?.utilization}, 100`}
                            d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <foreignObject x="0" y="3" width="36" height="26">
                           <div className="flex items-center h-full w-full flex-col pt-[5px]">
                            <p className="text-center text-[3px]">
                                <b className="text-center text-[9px]">{running ? simulation?.utilization : '0'}%</b>
                                <span className="block">Utilization</span>
                            </p>
                        </div>

                            </foreignObject>
                        </svg>
                        </div>
                        <div>
                            <p><b className="text-4xl">{simulation ? formatTime(simulation.time) : '00:00:00'}</b></p>
                            <p className="text-sm">Runtime</p>
                        </div>
                        <div>
                            <p><b className="text-4xl">{jobs.length}</b></p>
                            <p className="text-sm">Processes</p>
                        </div>
                        <div>
                            <p><b className="text-4xl">{simulation ? simulation.jobText : 'Idle'}</b></p>
                            <p className="text-sm">Current Process</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gantt Chart Card */}
            {/* <div className="col-span-2 row-span-2 col-start-5 row-start-11 h-full">
                <Card className="bg-yellow-100/50  h-full">
                    <CardHeader className="bg-amber-400 text-slate-950  h-[20px] justify-center items-center rounded-t">
                        <h6>Gantt Chart</h6>
                    </CardHeader>
                      <CardContent className="flex flex- start items-center justify-center h-[85px] px-4 pt-4">
                        <div className="flex items-center mb-4">
                            <ChevronRightIcon className="h-[20px] w-[20px]" />
                        </div>
                        <ScrollArea className="overflow-x-auto whitespace-nowrap w-full h-full max-w-9xl mx-auto"
                        ref={scrollAreaRef}>
                                <div className="flex flex-grow justify-start items-start space-x-1">
                                {simulation?.ganttChart.map((item, index) => (
                                    <div key={index} className={`rounded-md gantt-lg-${item}`}>
                                        {item}
                                    </div>
                                ))}
                                </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div> */}
        </div>
      </div>
    </>
  );
}

export default PCB;
