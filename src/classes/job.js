export class Job {
  constructor(jobId, arriveTime, burst, priority) {
    this.id = jobId;
    this.arrivalTime = arriveTime;
    this.burst = burst;
    this.priority = priority;
    this.startTime = 0;
    this.finishTime = 0;
    this.remaining = this.burst;
  }

  static createRandomJob(jobId) {
    // Random numbers limits are selected by trial and error to ensure job GUI representation
    // won't exceed the program screen limits
    const random = (max, min = 1) => Math.floor(Math.random() * max) + min;
    const arriveTime = jobId === 1 ? 1 : random(30, 2);
    const burst = random(12);
    const priority = random(125);
    return new Job(jobId, arriveTime, burst, priority);
  }

  get started() {
    return this.burst !== this.remaining;
  }

  get finished() {
    return this.remaining === 0;
  }

  get percent() {
    return Math.floor(((this.burst - this.remaining) * 100) / this.burst);
  }

  reset() {
    this.startTime = 0;
    this.finishTime = 0;
    this.remaining = this.burst;
  }

  process(simulationTime) {
    if (this.finished) {
      throw new Error("Can't work on finished job");
    }
    if (!this.started) {
      this.startTime = simulationTime;
    }
    this.remaining--;
    if (this.finished) {
      this.finishTime = simulationTime + 1;
    }
  }

  getTurnaroundTime(simulationTime) {
    if (!this.started) {
      return 0;
    }
    if (this.finished) {
      return this.finishTime - this.arrivalTime;
    }
    return simulationTime + 1 - this.arrivalTime;
  }

  getWaitingTime(simulationTime) {
    return this.getTurnaroundTime(simulationTime) - (this.burst - this.remaining);
  }

  clone() {
    const job = new Job(this.id, this.arrivalTime, this.burst, this.priority);
    job.startTime = this.startTime;
    job.finishTime = this.finishTime;
    job.remaining = this.remaining;
    return job;
  }

  compareById(other) {
    return this.id - other.id;
  }

  compareByArrive(other) {
    const tmp = this.arrivalTime - other.arrivalTime;
    return tmp === 0 ? this.compareById(other) : tmp;
  }

  compareByBurst(other) {
    const tmp = this.burst - other.burst;
    return tmp === 0 ? this.compareByArrive(other) : tmp;
  }

  compareByPriority(other) {
    const tmp = this.priority - other.priority;
    return tmp === 0 ? this.compareByArrive(other) : tmp;
  }

  compareByRemaining(other) {
    const tmp = this.remaining - other.remaining;
    return tmp === 0 ? this.compareByArrive(other) : tmp;
  }
}
