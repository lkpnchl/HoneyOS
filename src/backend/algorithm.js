export class Algorithm {
  constructor() {
    this.isPreemptive = false; // Flag to determine if the algorithm is preemptive or not
  }

  processQueue(readyQueue, currentJob) {
    if (currentJob && this.isPreemptive) {
      readyQueue.push(currentJob); // Add the current job to the end of the queue if preemptive
    }
    readyQueue = this.orderQueue(readyQueue); // Order the queue based on the algorithm's criteria
    if (currentJob && !this.isPreemptive) {
      readyQueue.unshift(currentJob); // Add the current job to the front of the queue if non-preemptive
    }
  }

  orderQueue(readyQueue) {
    return readyQueue.sort((a, b) => a.compareByArrive(b)); // Order the queue based on the arrival time
  }
}

export class FirstComeFirstServe extends Algorithm { }

export class ShortestJobFirst extends Algorithm {
  orderQueue(readyQueue) {
    return readyQueue.sort((a, b) => a.compareByBurst(b)); // Order the queue based on the burst time
  }
}

export class Priority extends Algorithm {
  orderQueue(readyQueue) {
    return readyQueue.sort((a, b) => {
      if (a.priority === b.priority) {
        return b.waitingTime - a.waitingTime; // Higher waiting time gets higher priority
      }
      return a.compareByPriority(b); // Order the queue based on the priority
    });
  }
}

export class STRF extends Algorithm { // Shortest Job First but preemptive
  constructor() {
    super();
    this.isPreemptive = true; // Set the algorithm as preemptive
  }

  orderQueue(readyQueue) {
    return readyQueue.sort((a, b) => a.compareByRemaining(b)); // Order the queue based on the remaining time
  }
}

export class RoundRobin extends Algorithm {
  constructor(quantum) {
    super();
    this.quantumTime = quantum; // Set the quantum time for the Round Robin algorithm
    this.processTime = 0; // Initialize the process time
  }

  processQueue(readyQueue, currentJob) {
    if (!currentJob) {
      this.processTime = 0; // Reset the process time if there is no current job
      return;
    }

    // Increment the process time for the current job
    this.processTime++;

    // Check if the current job has reached the quantum time
    if (this.processTime === this.quantumTime) {
      currentJob.setStatus("Ready"); // Set the status of the current job to "Ready" before pushing it back to the queue
      readyQueue.push(currentJob); // Push the current job back to the queue
      this.processTime = 0; // Reset the process time
    } else {
      readyQueue.unshift(currentJob); // Put the current job back to the front of the queue
    }
    
    // Apply the queue ordering after adding the current job back
    return this.orderQueue(readyQueue);
  }
}
