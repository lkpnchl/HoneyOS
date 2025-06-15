export class Job {
  constructor(jobId, arriveTime, burst, priority, memory) {
    this.id = jobId; // Job ID
    this.arrivalTime = arriveTime; // Arrival time of the job
    this.burst = burst; // Burst time of the job
    this.priority = priority; // Priority of the job
    this.memory = memory; // Memory required by the job
    this.startTime = 0; // Start time of the job
    this.finishTime = 0; // Finish time of the job
    this.remaining = this.burst; // Remaining burst time of the job
    this.processed = false; // Flag to indicate if the job has been processed
    this.waitingTime = 0; // Waiting time of the job
    this.status = "New"; // Status of the job
    this.heap = null; // Heap associated with the job
  }

  // Set the status of the job
  setStatus(status) {
    const validStatuses = ["New", "Ready", "Running", "Waiting", "Suspended", "Terminated", "Waiting For Memory"];
    if (validStatuses.includes(status)) {
        this.status = status;
    } 
  }

  // Update the waiting time of the job
  updateWaitingTime() {
    if (this.status === "Ready") {
      this.waitingTime++;
    }
  }

  // Create a random job
  static createRandomJob(jobId) {
    
    const ranges = [
        { min: 50, max: 120, probability: 0.75 },
        { min: 121, max: 150, probability: 0.15 },
        { min: 151, max: 256, probability: 0.10 }
    ];

    const weightedRandom = () => {
        const random = Math.random();
        let sum = 0;

        for (const range of ranges) {
            sum += range.probability;
            if (random <= sum) {
                return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            }
        }
    };

    const random = (max, min = 1) => Math.floor(Math.random() * max) + min;
    const arriveTime = jobId === 1 ? 1 : random(20, 2);
    const burst = jobId === 1 ? random(15,5) : random(15, 1);
    const priority = random(15);
    const memory = weightedRandom();
    return new Job(jobId, arriveTime, burst, priority, memory);
  }

  // Create a set of predefined jobs for simulation
  static createPredefinedJobs() {
    const predefinedJobs = [
      new Job(1, 0, 4, 3, 64),    // Job 1: arrives at 0, burst=4, priority=3, memory=64MB
      new Job(2, 1, 8, 1, 128),   // Job 2: arrives at 1, burst=8, priority=1, memory=128MB
      new Job(3, 2, 3, 2, 96),    // Job 3: arrives at 2, burst=3, priority=2, memory=96MB
      new Job(4, 3, 6, 4, 256),   // Job 4: arrives at 3, burst=6, priority=4, memory=256MB
      new Job(5, 4, 5, 5, 32),    // Job 5: arrives at 4, burst=5, priority=5, memory=32MB
      new Job(6, 6, 2, 6, 64),    // Job 6: arrives at 6, burst=2, priority=6, memory=64MB
      new Job(7, 8, 9, 7, 512),   // Job 7: arrives at 8, burst=9, priority=7, memory=512MB
      new Job(8, 9, 3, 8, 128),   // Job 8: arrives at 9, burst=3, priority=8, memory=128MB
      new Job(9, 10, 7, 2, 256),  // Job 9: arrives at 10, burst=7, priority=2, memory=256MB
      new Job(10, 12, 4, 1, 64)   // Job 10: arrives at 12, burst=4, priority=1, memory=64MB
    ];
    
    return predefinedJobs;
  }

  // Check if the job has started
  get started() {
    return this.burst !== this.remaining;
  }

  // Check if the job has finished
  get finished() {
    return this.remaining === 0;
  }

  // Calculate the percentage of completion of the job
  get percent() {
    return Math.floor(((this.burst - this.remaining) * 100) / this.burst);
  }

  // Reset the job to its initial state
  reset() {
    this.startTime = 0;
    this.finishTime = 0;
    this.remaining = this.burst;
    this.processed = false; // Reset processed flag
    this.status = "New";
  }

  // Process the job
  process(simulationTime) {
    if (this.finished || this.processed) {
      console.log("Job already finished or processed", this.id, this.finished, this.processed);
      return;
    }
    if (!this.started) {
      this.startTime = simulationTime;
    }
    this.remaining--;
    if (this.finished) {
      this.finishTime = simulationTime + 1;
    }
  }

  // Calculate the turnaround time of the job
  getTurnaroundTime(simulationTime) {
    if (!this.started) {
      return 0;
    }
    if (this.finished) {
      return this.finishTime - this.arrivalTime;
    }
    return simulationTime + 1 - this.arrivalTime;
  }

  // Calculate the waiting time of the job
  getWaitingTime(simulationTime) {
    return this.getTurnaroundTime(simulationTime) - (this.burst - this.remaining);
  }

  // Clone the job
  clone() {
    const job = new Job(this.id, this.arrivalTime, this.burst, this.priority, this.memory);
    job.startTime = this.startTime;
    job.finishTime = this.finishTime;
    job.remaining = this.remaining;
    job.processed = this.processed;
    job.status = this.status;
    return job;
  }

  // Compare jobs by ID
  compareById(other) {
    return this.id - other.id;
  }

  // Compare jobs by arrival time
  compareByArrive(other) {
    const tmp = this.arrivalTime - other.arrivalTime;
    return tmp === 0 ? this.compareById(other) : tmp;
  }

  // Compare jobs by burst time
  compareByBurst(other) {
    const tmp = this.burst - other.burst;
    return tmp === 0 ? this.compareByArrive(other) : tmp;
  }

  // Compare jobs by priority
  compareByPriority(other) {
    const tmp = this.priority - other.priority;
    return tmp === 0 ? this.compareByArrive(other) : tmp;
  }

  // Compare jobs by memory
  compareByMemory(other) {
    const tmp = this.memory - other.memory;
    return tmp === 0 ? this.compareById(other) : tmp;
  }

  // Compare jobs by remaining burst time
  compareByRemaining(other) {
    const tmp = this.remaining - other.remaining;
    return tmp === 0 ? this.compareByArrive(other) : tmp;
  }
}
