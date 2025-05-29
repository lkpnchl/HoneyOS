// Base class for replacement algorithms
export class ReplacementAlgorithm {
  constructor() {
    this.name = 'Base Algorithm';
  }

  // Replace a page in the frames array and return the index of the replaced frame
  replace(frames, reference, futureReferences = []) {
    throw new Error('Method not implemented');
  }
}

// First-In-First-Out (FIFO) algorithm
export class FIFO extends ReplacementAlgorithm {
  constructor() {
    super();
    this.name = 'First-In-First-Out (FIFO)';
    this.insertionOrder = []; // Keep track of the order in which pages were inserted
  }

  replace(frames, reference, futureReferences) {
    // If there's an empty frame, use it
    const emptyFrameIndex = frames.findIndex(frame => frame === undefined);
    if (emptyFrameIndex !== -1) {
      this.insertionOrder.push(emptyFrameIndex);
      return emptyFrameIndex;
    }

    // Otherwise, replace the oldest frame
    const replaceIndex = this.insertionOrder.shift();
    this.insertionOrder.push(replaceIndex);
    return replaceIndex;
  }

  // Reset the algorithm state
  reset() {
    this.insertionOrder = [];
  }
}

// Least Recently Used (LRU) algorithm
export class LRU extends ReplacementAlgorithm {
  constructor() {
    super();
    this.name = 'Least Recently Used (LRU)';
    this.usageOrder = []; // Keep track of the order in which pages were used
  }

  replace(frames, reference, futureReferences) {
    // If there's an empty frame, use it
    const emptyFrameIndex = frames.findIndex(frame => frame === undefined);
    if (emptyFrameIndex !== -1) {
      this.usageOrder.push(emptyFrameIndex);
      return emptyFrameIndex;
    }

    // Update the usage order for the current reference if it's in frames
    const referenceIndex = frames.findIndex(frame => frame === reference);
    if (referenceIndex !== -1) {
      // Move this frame to the end of usageOrder (most recently used)
      this.usageOrder = this.usageOrder.filter(index => index !== referenceIndex);
      this.usageOrder.push(referenceIndex);
    }

    // Replace the least recently used page
    const replaceIndex = this.usageOrder.shift();
    this.usageOrder.push(replaceIndex);
    return replaceIndex;
  }

  // Reset the algorithm state
  reset() {
    this.usageOrder = [];
  }
}

// Optimal (OPT) algorithm
export class OPT extends ReplacementAlgorithm {
  constructor() {
    super();
    this.name = 'Optimal (OPT)';
  }

  replace(frames, reference, futureReferences) {
    // If there's an empty frame, use it
    const emptyFrameIndex = frames.findIndex(frame => frame === undefined);
    if (emptyFrameIndex !== -1) {
      return emptyFrameIndex;
    }

    // Find the page that will not be used for the longest time in the future
    let farthestUseIndex = -1;
    let farthestUseDistance = -1;

    for (let i = 0; i < frames.length; i++) {
      const page = frames[i];
      
      // Find the next occurrence of this page in future references
      const nextOccurrenceIndex = futureReferences.indexOf(page);
      
      // If the page will never be used again, return this index immediately
      if (nextOccurrenceIndex === -1) {
        return i;
      }
      
      // Otherwise, track the page that will be used the farthest in the future
      if (nextOccurrenceIndex > farthestUseDistance) {
        farthestUseDistance = nextOccurrenceIndex;
        farthestUseIndex = i;
      }
    }

    return farthestUseIndex;
  }

  // No state to reset
  reset() {}
}

// Clock algorithm (Second Chance)
export class CLOCK extends ReplacementAlgorithm {
  constructor() {
    super();
    this.name = 'Clock (Second Chance)';
    this.pointer = 0; // Current position of the clock hand
    this.referenceFlags = []; // 1 = recently used, 0 = not recently used
  }

  replace(frames, reference, futureReferences) {
    // Initialize or resize the reference flags array if needed
    if (this.referenceFlags.length !== frames.length) {
      this.referenceFlags = Array(frames.length).fill(0);
    }

    // If there's an empty frame, use it
    const emptyFrameIndex = frames.findIndex(frame => frame === undefined);
    if (emptyFrameIndex !== -1) {
      this.referenceFlags[emptyFrameIndex] = 1; // Set reference bit to 1
      return emptyFrameIndex;
    }

    // Update the reference bit for the current reference if it's in frames
    const referenceIndex = frames.findIndex(frame => frame === reference);
    if (referenceIndex !== -1) {
      this.referenceFlags[referenceIndex] = 1;
    }

    // Search for a page with reference bit = 0 (not recently used)
    while (true) {
      // If the current frame has reference bit = 0, replace it
      if (this.referenceFlags[this.pointer] === 0) {
        const replaceIndex = this.pointer;
        this.pointer = (this.pointer + 1) % frames.length; // Move the pointer
        this.referenceFlags[replaceIndex] = 1; // Set reference bit for new page
        return replaceIndex;
      }
      
      // Otherwise, give this frame a second chance
      this.referenceFlags[this.pointer] = 0;
      this.pointer = (this.pointer + 1) % frames.length; // Move the pointer
    }
  }

  // Reset the algorithm state
  reset() {
    this.pointer = 0;
    this.referenceFlags = [];
  }
} 