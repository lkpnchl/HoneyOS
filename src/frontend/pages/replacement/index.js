import React, { useState, useEffect, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { ScrollArea } from "../../components/ui/scroll-area";
import { ReplacementSimulation } from "../../../backend/replacement/simulation";
import { FIFO, LRU, OPT, CLOCK } from "../../../backend/replacement/algorithms";
import styles from './replacement.module.css';

function ReplacementPage() {
  // State for simulation configuration
  const [frameCount, setFrameCount] = useState(3);
  const [algorithm, setAlgorithm] = useState("fifo");
  const [referenceString, setReferenceString] = useState("1,2,3,4,1,2,5,1,2,3,4,5");
  const [simulation, setSimulation] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [faultCount, setFaultCount] = useState(0);
  const [hitCount, setHitCount] = useState(0);
  const [quantum, setQuantum] = useState(4);
  
  // Initialize simulation
  const initializeSimulation = () => {
    let algo;
    switch (algorithm) {
      case "lru":
        algo = new LRU();
        break;
      case "opt":
        algo = new OPT();
        break;
      case "clock":
        algo = new CLOCK();
        break;
      default:
        algo = new FIFO();
    }
    
    const refArray = referenceString.split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseInt(s, 10));
      
    if (refArray.some(isNaN)) {
      alert("Invalid reference string! Please enter only numbers separated by commas.");
      return null;
    }
    
    return new ReplacementSimulation(algo, frameCount, refArray);
  };
  
  // Start the simulation
  const startSimulation = () => {
    const newSimulation = initializeSimulation();
    if (newSimulation) {
      setSimulation(newSimulation);
      setCurrentStep(0);
      setFaultCount(0);
      setHitCount(0);
      setIsRunning(true);
      setIsPaused(false);
    }
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    setSimulation(null);
    setCurrentStep(0);
    setFaultCount(0);
    setHitCount(0);
    setIsRunning(false);
    setIsPaused(false);
  };
  
  // Step through the simulation
  const stepSimulation = () => {
    if (!simulation || currentStep >= simulation.referenceString.length) return;
    
    const result = simulation.nextStep();
    setCurrentStep(currentStep + 1);
    
    if (result.fault) {
      setFaultCount(faultCount + 1);
    } else {
      setHitCount(hitCount + 1);
    }
  };
  
  // Pause/resume the simulation
  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Run the simulation automatically with a delay
  useEffect(() => {
    let timer;
    if (isRunning && !isPaused && simulation && currentStep < simulation.referenceString.length) {
      timer = setTimeout(stepSimulation, 1000);
    }
    return () => clearTimeout(timer);
  }, [isRunning, isPaused, currentStep, simulation]);
  
  // Render the frames
  const renderFrames = () => {
    if (!simulation) return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Start the simulation to see page replacement in action
      </div>
    );
    
    return (
      <div className={styles.framesContainer}>
        <div className={styles.frameHeaders}>
          {Array.from({ length: frameCount }).map((_, index) => (
            <div key={`header-${index}`} className={styles.frameHeader}>
              Frame {index + 1}
            </div>
          ))}
          <div className={styles.frameHeader}>Reference</div>
          <div className={styles.frameHeader}>Status</div>
        </div>
        <div className={styles.frameRows}>
          {simulation.history.map((step, stepIndex) => (
            <div 
              key={`step-${stepIndex}`} 
              className={`${styles.frameRow} ${stepIndex === currentStep - 1 ? styles.currentStep : ''}`}
            >
              {Array.from({ length: frameCount }).map((_, frameIndex) => {
                const value = step.frames[frameIndex];
                const isMostRecent = step.mostRecentlyAdded === frameIndex;
                return (
                  <div 
                    key={`cell-${stepIndex}-${frameIndex}`} 
                    className={`${styles.frameCell} ${isMostRecent ? styles.mostRecent : ''}`}
                  >
                    {value !== undefined ? value : '-'}
                  </div>
                );
              })}
              <div className={styles.referenceCell}>
                {simulation.referenceString[stepIndex]}
              </div>
              <div className={`${styles.resultCell} ${step.fault ? styles.fault : styles.hit}`}>
                {step.fault ? 'FAULT' : 'HIT'}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Calculate hit rate
  const hitRate = (isRunning && (hitCount + faultCount) > 0) 
    ? ((hitCount / (hitCount + faultCount)) * 100).toFixed(2) 
    : '0.00';

  const getFormattedTime = () => {
    return "00:00:00";
  }

  return (
    <div className={styles.replacementPage}>
      <div className={styles.controlPanel}>
        {/* Policy Section */}
        <div className={styles.configCard}>
          <div className={styles.cardHeader}>Policy</div>
          <div className={styles.cardContent}>
            <div className={styles.algorithmButtons}>
              <button 
                className={`${styles.algoButton} ${algorithm === 'fifo' ? styles.selected : ''}`} 
                onClick={() => !isRunning && setAlgorithm('fifo')}
                disabled={isRunning}
              >
                First In, First Out
              </button>
              <button 
                className={`${styles.algoButton} ${algorithm === 'lru' ? styles.selected : ''}`}
                onClick={() => !isRunning && setAlgorithm('lru')}
                disabled={isRunning}
              >
                Least Recently Used
              </button>
              <button 
                className={`${styles.algoButton} ${algorithm === 'opt' ? styles.selected : ''}`}
                onClick={() => !isRunning && setAlgorithm('opt')}
                disabled={isRunning}
              >
                Optimal
              </button>
              <button 
                className={`${styles.algoButton} ${algorithm === 'clock' ? styles.selected : ''}`}
                onClick={() => !isRunning && setAlgorithm('clock')}
                disabled={isRunning}
              >
                Clock
              </button>
            </div>

            <div className={styles.configItem}>
              <label>Frame Count:</label>
              <Input 
                type="number" 
                min="1" 
                max="10" 
                value={frameCount} 
                onChange={(e) => !isRunning && setFrameCount(Math.min(10, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                disabled={isRunning}
              />
            </div>
            
            <div className={styles.configItem}>
              <label>Reference String:</label>
              <Input 
                type="text" 
                value={referenceString} 
                onChange={(e) => !isRunning && setReferenceString(e.target.value)}
                disabled={isRunning}
                placeholder="Enter numbers separated by commas"
              />
            </div>

            {algorithm === 'clock' && (
              <div className={styles.quantumControl}>
                <label>Reference Bit Reset Time</label>
                <Input
                  type="number"
                  min="1"
                  value={quantum}
                  onChange={(e) => !isRunning && setQuantum(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  disabled={isRunning}
                />
              </div>
            )}
            
            <div className={styles.buttonGroup}>
              {!isRunning ? (
                <Button onClick={startSimulation} className={styles.startButton}>
                  ▶ Start Simulation
                </Button>
              ) : (
                <>
                  <Button onClick={togglePause} className={styles.pauseButton}>
                    {isPaused ? '▶ Resume' : '⏸ Pause'}
                  </Button>
                  <div className="flex gap-2 mt-2">
                    <Button onClick={stepSimulation} className={styles.stepButton} disabled={isPaused || currentStep >= (simulation?.referenceString.length || 0)}>
                      Step
                    </Button>
                    <Button onClick={resetSimulation} className={styles.resetButton}>
                      ↺ Reset
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Simulation Section */}
        <div className={styles.simulationPanel}>
          <div className={styles.simulationCard}>
            <div className={styles.cardHeader}>Page References</div>
            <div className={styles.tableContainer}>
              {renderFrames()}
            </div>
          </div>
        </div>
        
        {/* Stats Section */}
        <div className={styles.statsCard}>
          <div className={styles.cardHeader}>Memory</div>
          <div className={styles.cardContent}>
            <div className={styles.memoryVisualizer}>
              <span className={styles.memoryText}>
                {isRunning ? "Active" : "Available"}
              </span>
            </div>
            
            <div className={styles.statItem}>
              <span>Page Faults:</span>
              <span className={styles.faultCount}>{faultCount}</span>
            </div>
            <div className={styles.statItem}>
              <span>Page Hits:</span>
              <span className={styles.hitCount}>{hitCount}</span>
            </div>
            <div className={styles.statItem}>
              <span>Hit Rate:</span>
              <span className={styles.hitRate}>{hitRate}%</span>
            </div>
            <div className={styles.statItem}>
              <span>Current Step:</span>
              <span>{currentStep} / {simulation?.referenceString.length || 0}</span>
            </div>
            
            <div className={styles.memoryUsage}>
              {hitCount} Hit / {faultCount} Miss ({hitRate}%)
            </div>
          </div>

          <div className={styles.cardHeader}>Stats</div>
          <div className={styles.cardContent}>
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold mb-2">{hitRate}%</div>
              <div className="text-sm text-gray-600">Hit Rate</div>
            </div>
            
            <div className="flex justify-between mt-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{getFormattedTime()}</div>
                <div className="text-sm text-gray-600">Runtime</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold">{currentStep}</div>
                <div className="text-sm text-gray-600">Steps</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.algorithmInfo}>
        <h3>About {algorithm.toUpperCase()}</h3>
        {algorithm === "fifo" && (
          <p>First-In-First-Out (FIFO) replaces the page that has been in memory the longest. It's simple to implement but may not always be effective.</p>
        )}
        {algorithm === "lru" && (
          <p>Least Recently Used (LRU) replaces the page that hasn't been accessed for the longest time. It works well in practice but can be expensive to implement.</p>
        )}
        {algorithm === "opt" && (
          <p>Optimal (OPT) replaces the page that will not be used for the longest time in the future. It's theoretical and provides the best possible performance.</p>
        )}
        {algorithm === "clock" && (
          <p>Clock algorithm is an approximation of LRU that uses a reference bit for each page. It gives each page a "second chance" before replacement.</p>
        )}
      </div>
    </div>
  );
}

export default ReplacementPage; 