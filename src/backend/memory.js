export class MemoryManager {
  constructor(totalMemory) {
    this.totalMemory = totalMemory;
    this.segments = [{ start: 0, end: totalMemory, jobId: null }]; // Initial segment covering the entire memory
  }

  // Allocate memory for a job
  allocateMemory(job) {
    const requiredMemory = job.memory;
    let bestFitIndex = -1;
    let smallestFreeSegment = Infinity;

    // Find the best fit segment for the job
    for (let i = 0; i < this.segments.length; i++) {
      const segment = this.segments[i];
      if (segment.jobId === null && segment.end - segment.start >= requiredMemory) {
        const segmentSize = segment.end - segment.start;
        if (segmentSize < smallestFreeSegment) {
          bestFitIndex = i;
          smallestFreeSegment = segmentSize;
        }
      }
    }

    if (bestFitIndex !== -1) {
      const bestFitSegment = this.segments[bestFitIndex];
      bestFitSegment.jobId = job.id;
      // Split the segment if it's larger than the required memory
      if (bestFitSegment.end - bestFitSegment.start > requiredMemory) {
        const newSegment = { start: bestFitSegment.start + requiredMemory, end: bestFitSegment.end, jobId: null };
        bestFitSegment.end = bestFitSegment.start + requiredMemory;
        this.segments.splice(bestFitIndex + 1, 0, newSegment);
      }
      return true;
    }

    return false; // Not enough contiguous memory available
  }

  // Deallocate memory for a job
  deallocateMemory(job) {
    // Find the segment with the job ID
    let segmentIndex = -1;
    for (let i = 0; i < this.segments.length; i++) {
      if (this.segments[i].jobId === job.id) {
        segmentIndex = i;
        break;
      }
    }

    if (segmentIndex === -1) return; // Job segment not found

    // Mark the segment as free
    this.segments[segmentIndex].jobId = null;

    // Merge with adjacent free segments
    this.mergeAdjacentFreeSegments();
  }

  // Helper method to merge all adjacent free segments
  mergeAdjacentFreeSegments() {
    // Start from index 0 and continue until we reach the end of the array
    let i = 0;
    while (i < this.segments.length - 1) {
      const currentSegment = this.segments[i];
      const nextSegment = this.segments[i + 1];
      
      // If both current and next segments are free, merge them
      if (currentSegment.jobId === null && nextSegment.jobId === null) {
        // Extend the current segment to the end of the next segment
        currentSegment.end = nextSegment.end;
        // Remove the next segment
        this.segments.splice(i + 1, 1);
        // Don't increment i since we need to check the new adjacent segment
      } else {
        // Move to the next segment
        i++;
      }
    }
  }

  // Reset memory to initial state with a single free segment
  resetMemory() {
    this.segments = [{ start: 0, end: this.totalMemory, jobId: null }];
  }
}
