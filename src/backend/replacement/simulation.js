// Simulation class for page replacement algorithms
export class ReplacementSimulation {
  constructor(algorithm, frameCount, referenceString) {
    this.algorithm = algorithm;
    this.frameCount = frameCount;
    this.referenceString = referenceString;
    this.frames = Array(frameCount).fill(undefined);
    this.currentStep = 0;
    this.history = [];
    
    // Initialize algorithm
    this.algorithm.reset();
  }
  
  // Process the next reference and return the result
  nextStep() {
    if (this.currentStep >= this.referenceString.length) {
      return null;
    }
    
    const currentReference = this.referenceString[this.currentStep];
    const futureReferences = this.referenceString.slice(this.currentStep + 1);
    
    // Check if the current reference is already in a frame
    const frameIndex = this.frames.findIndex(frame => frame === currentReference);
    let fault = false;
    let replacedFrameIndex = -1;
    
    // If not in frames, we have a page fault
    if (frameIndex === -1) {
      fault = true;
      // Replace a frame using the algorithm
      replacedFrameIndex = this.algorithm.replace(
        [...this.frames], // Clone frames to avoid direct modification
        currentReference,
        futureReferences
      );
      // Update frames
      this.frames[replacedFrameIndex] = currentReference;
    }
    
    // Record the current state in history
    this.history.push({
      reference: currentReference,
      frames: [...this.frames], // Clone to avoid reference issues
      fault,
      mostRecentlyAdded: fault ? replacedFrameIndex : frameIndex
    });
    
    // Move to the next step
    this.currentStep++;
    
    return {
      reference: currentReference,
      frames: [...this.frames],
      fault,
      mostRecentlyAdded: fault ? replacedFrameIndex : frameIndex
    };
  }
  
  // Reset the simulation
  reset() {
    this.frames = Array(this.frameCount).fill(undefined);
    this.currentStep = 0;
    this.history = [];
    this.algorithm.reset();
  }
  
  // Run the entire simulation at once
  runComplete() {
    this.reset();
    while (this.currentStep < this.referenceString.length) {
      this.nextStep();
    }
    return this.history;
  }
  
  // Get statistics from the simulation
  getStatistics() {
    const faultCount = this.history.filter(step => step.fault).length;
    const hitCount = this.history.length - faultCount;
    const hitRate = hitCount / this.history.length;
    
    return {
      faultCount,
      hitCount,
      hitRate,
      totalSteps: this.history.length
    };
  }
} 