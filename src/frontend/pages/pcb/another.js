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
import { FirstComeFirstServe, ShortestJobFirst, Priority, PreemptivePriority, STRF, RoundRobin } from '../../../classes/algorithm';
import { Job } from '../../../classes/job';
import { Simulation } from '../../../classes/simulation';
import {ReactComponent as PlayIcon} from '../../assets/img/play-fill.svg'
import {ReactComponent as PausePlayIcon} from '../../assets/img/play-pause.svg'
// import './styles.css'
import './styles.scss'
import MemoryManagement from "../../components/memory";

// PCB component simulates a CPU scheduling simulation using various algorithms
function PCB3() {
    const navigate = useNavigate();  // Hook to navigate programmatically
    const [title, setTitle] = useState('CPU-Scheduling-Simulator');  // State for the title
    const [simulation, setSimulation] = useState(null);  // State for the simulation object
    const [jobs, setJobs] = useState([]);  // State for the list of jobs
    const [simSpeed, setSimSpeed] = useState(1250);  // State for the simulation speed
    const [quantum, setQuantum] = useState(4);  // State for the quantum time (used in Round Robin)
    const [jobCount, setJobCount] = useState(0);  // State for the number of jobs
    const [algo, setAlgo] = useState('fcfs');  // State for the selected algorithm
    const [selectedAlgo, setSelectedAlgo] = useState(false);  // State for the selected algorithm
    const [running, setRunning] = useState(false);  // State to determine if the simulation is running
    const [started, setStarted] = useState(false); // simulation started
    const [paused, setPaused] = useState(false); // simulation paused
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
        const newJobs = [];
        for (let i = 0; i < Number(1); i++) {
            newJobs.push(Job.createRandomJob(i + 1));
        }
        setJobs(newJobs);
        const algorithm = getAlgorithm(selectedAlgo); // Pass the selected algorithm
        algorithm.quantumTime = Number(quantum);
        const sim = new Simulation(algorithm, newJobs, memorySize);
        sim.reset();
        setSimulation(sim);
    };

    // Function to start the simulation
    const play = (selectedAlgo) => {
        setStarted(true);
        if (!running) {
            newSim(selectedAlgo);
            setRunning(true);
            console.log(algo)
        }
        console.log(started)
    };

    // Function to stop the simulation
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
    

    const [yieeeRR, setYieeeRR] = useState(false);
    // Function to handle the change of the selected algorithm
    const handleAlgoChange = (event) => {
        const newValue = event.target.value;
        setAlgo(newValue);
        setSelectedAlgo(true);
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
const scrollAreaRef = useRef(null); // Initialize ref for ScrollArea
    return (
        <>
        <div className="h-screen">
        {/* <div className="grid grid-cols-3 items-center w-screen p-0">
          <h2 className="col-start-2 col-end-3 text-center">BusyBee</h2>
          <div className="text-right">
            <Button variant="icon" onClick={() => navigate("/desktop")}>
              <Cross2Icon />
            </Button>
          </div>
        </div> */}
        <div className="grid grid-cols-6 grid-rows-8 relative flex bg-orange-50 h-[650px] w-full p-5 justify-center items-center text-center rounded-lg gap-4 box-shadow-lg">     
            {/* Scheduling Policy Card */}
            <div className="row-span-12 h-full gap-4" >
                <Card className="bg-yellow-100/50 justify-center item-center  h-full mb-4">
                    <CardHeader className="bg-amber-400 text-slate-950  h-[20px] justify-center items-center rounded-t">
                        <h6>Policy</h6>
                    </CardHeader>
                    <CardContent className="justify-center items-center h-[400px] space-y-7 px-4 pt-5">
                        <div className="w-full flex flex-col items-center">
                            <div className="flex justify-between items-center w-full">
                                <ToggleGroup
                                    type="single"
                                    className="grid grid-cols-1 gap-3 w-full"
                                    value={algo}
                                    onChange={handleAlgoChange}
                                    aria-label="Choose Algorithm"
                                >
                                    <ToggleGroupItem
                                        className="border-2 bg-white data-[state=on]:bg-yellow-300 hover:bg-yellow-100/50"
                                        value="fcfs"
                                        aria-label="Toggle fcfs"
                                        disabled={running || paused}
                                        running={selectedAlgo}
                                        onClick={handleAlgoChange}
                                    >
                                        <Button variant="link" value="fcfs">
                                            First Come, First Serve
                                        </Button>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        className="border-2 bg-white data-[state=on]:bg-yellow-300 hover:bg-yellow-100/50"
                                        value="sjf"
                                        aria-label="Toggle sjf"
                                        disabled={running || paused}
                                        running={selectedAlgo}
                                        onClick={handleAlgoChange}
                                    >
                                        <Button variant="link" value="sjf">
                                            Shortest Job First
                                        </Button>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        className="border-2 bg-white data-[state=on]:bg-yellow-300 hover:bg-yellow-100/50"
                                        value="p"
                                        aria-label="Toggle p"
                                        disabled={running || paused}
                                        running={selectedAlgo}
                                        onClick={handleAlgoChange}
                                    >
                                        <Button variant="link" value="p">
                                            Priority Scheduling
                                        </Button>
                                    </ToggleGroupItem>
                                    <ToggleGroupItem
                                        className="border-2 bg-white data-[state=on]:bg-yellow-300"
                                        value="rr"
                                        aria-label="Toggle rr"
                                        disabled={running || paused}
                                        running={selectedAlgo}
                                        onClick={handleAlgoChange}
                                    >
                                        <Button variant="link" value="rr">
                                            Round Robin
                                        </Button>
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                        </div>
                        <div className="flex flex-col items-center w-full mt-3">
                            <div className="grid grid-cols-1 gap-3 w-full">
                                <Button
                                    variant="nohover"
                                    className="h-10 flex gap-2 bg-green-500 bg-green-600"
                                    onClick={() => play(algo)}
                                    disabled={running || paused}
                                >
                                    <PlayIcon />
                                    Start
                                </Button>
                                {running !== true ? (
                                    <Button
                                        variant="nohover"
                                        className="h-10 flex gap-2 bg-gray-400 bg-orange-600"
                                        onClick={resume}
                                        disabled={!started}
                                    >
                                        <PausePlayIcon />
                                        Resume
                                    </Button>
                                ) : (
                                    <Button
                                        variant="nohover"
                                        className="h-10 flex gap-2 bg-gray-400 bg-orange-600"
                                        onClick={pause}
                                        disabled={!started}
                                    >
                                        <PausePlayIcon />
                                        Pause
                                    </Button>
                                )}
                                <Button
                                    variant="nohover"
                                    className="h-10 flex gap-2 bg-gray-400 bg-red-600"
                                    // onClick={reset} #set function to stop adding new jobs and continue finish the current jobs
                                    disabled={!started}
                                >
                                    <StopIcon />
                                    Stop
                                </Button>
                                <Button
                                    variant="nohover"
                                    className="h-10 flex gap-2 bg-gray-400 bg-emerald-500"
                                    onClick={reset}
                                    disabled={!started}
                                >
                                    <ReloadIcon />
                                    Clear
                                </Button>
                            </div>
                        </div>
                        {yieeeRR === true? (
                        <div className="flex flex-col items-center justify-center w-full">
                             <p className="text-xl">Quantum Time</p>
                                {started === false? (
                                    <Input 
                                        value={quantum} 
                                        onChange={handleInputChange} 
                                        className="outline-none border-0 border-b-2 border-orange-500 bg-transparent h-12 w-24 text-2xl font-bold rounded-none focus:border-orange-700 text-center"
                                        type="number" />
                                ) : (
                                    <p><b className="text-4xl">{quantum}</b></p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <p className="text-gray-500 text-xl">Quantum Time</p>
                                <p><b className="text-gray-500 text-2xl">Not Applicable</b></p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Job Pool Card */}
            <div className="row-span-4 overflow-hidden col-start-2 col-span-3 row-start-1 h-full">
                <Card className="bg-yellow-100/50 h-full">
                    <CardHeader className="bg-amber-400 text-slate-950 h-[20px] justify-center items-center rounded-t"><h6>Job Pool</h6></CardHeader>
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
                                <ReadyQTable simulation={simulation} />
                            </div>
                        </div>
                        <div className="row-span-1 flex justify-start items-center space-x-2 px-2 pb-1" style={{ maxHeight: '12%' }}>
                            <ChevronRightIcon className="h-[20px] w-[20px]" />
                            <ScrollArea className="overflow-x-auto whitespace-nowrap w-full max-w-7xl mx-auto">
                                <div className="flex flex-grow justify-start items-start  space-x-1 space">
                                    {/* {simulation?.readyQueue.map((item, index) => (
                                        <div key={index} className={`rounded-md gantt-sm-${item.id} flex-start`}>{item.id}</div>
                                    ))} */}
                                    {simulation?.ganttChart.map((item, index) => (
                                    <div key={index} className={`rounded-md gantt-thicc-${item} flex-start`}>
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
                        <MemoryManagement simulation={simulation} />
                    </CardContent>
                </Card>
            </div>

            {/* CPU Card */}
            <div className="row-span-12 col-start-6 row-start-1 col-span-1 h-full">
                <Card className="bg-yellow-100/50  h-full">
                    <CardHeader className="bg-amber-400 text-slate-950  h-[20px] justify-center items-center rounded-t">
                        <h6> CPU </h6>
                    </CardHeader>
                    <CardContent className="justify-center items-center align-middle pt-4  px-4 gap-4 grid grid-rows text-slate-950">
                        <div>
                            <p>No. of Jobs</p>
                            <p><b className="text-2xl">{jobs.length}</b></p>
                        </div>
                        <div>
                            <p>Current Job</p>
                            <p><b className="text-2xl">{simulation ? simulation.jobText : 'Idle'}</b></p>
                        </div>
                        <div>
                            <p>Runtime</p>
                            <p><b className="text-2xl">{simulation ? simulation.time : 0 }</b></p>
                        </div>
                        <div>
                            <p>Utilization</p>
                            <p><b className="text-2xl">{simulation ? simulation.utilization : 0}%
                            </b></p>
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

export default PCB3;
