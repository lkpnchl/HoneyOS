import React from 'react';
import styles from './memory.module.scss'; // Import CSS module

const MemoryManagement = ({ simulation }) => {
    
    if (!simulation || !simulation.memoryManager) {
        return (
            <div className="w-full h-full flex flex-col items-center pt-[24px]">
                <div className={`${styles.memoryContainer} w-full h-[475px] flex items-center justify-center mb-4 rounded-md`}>
                    Available
                </div>
             <> <b>0 MB / 1024 MB (0%) </b> Memory Usage </>
            </div>
        )
    }

    const { totalMemory, segments } = simulation.memoryManager;
    
    // Ensure segments exist and have valid structure
    if (!segments || segments.length === 0) {
        // If no segments exist, show a single free segment
        return (
            <div className="w-full h-full flex flex-col items-center pt-[24px]">
                <div className={`${styles.memoryContainer} w-full h-[475px] mb-2 flex flex-col`}>
                    <div 
                        className={styles.deallocatedBlock}
                        style={{ height: '100%' }}
                    >
                        Free
                    </div>
                </div>
                <> <b>0 / {totalMemory} MB (0%) </b> Memory Usage </>
            </div>
        );
    }

    const usedMemory = segments
        .filter(segment => segment.jobId !== null)
        .reduce((total, segment) => total + (segment.end - segment.start), 0);

    // Render memory segments with improved visibility
    const memorySegments = segments?.map((segment, index) => {
        const segmentSize = segment.end - segment.start;
        const percentHeight = (segmentSize / totalMemory) * 100;
        
        // Skip rendering very small segments (less than 0.5% of total)
        if (percentHeight < 0.5) return null;
        
        return (
            <div
                key={index}
                className={segment.jobId ? styles[`memory-allocated-${segment.jobId}`] : styles.deallocatedBlock}
                style={{ 
                    height: `${percentHeight}%`,
                    border: segment.jobId ? '1px solid rgba(0,0,0,0.1)' : '1px dashed rgba(0,0,0,0.2)',
                }}
            >
                {segment.jobId ? `Job ${segment.jobId}` : 'Free'}
            </div>
        );
    }).filter(Boolean); // Remove null elements

    const percentage = Math.floor((usedMemory / totalMemory) * 100);

    return (
        <div className="w-full h-full flex flex-col items-center pt-[24px]">
            <div className={`${styles.memoryContainer} w-full h-[475px] mb-2 flex flex-col bg-border-orange-500 border-b-2`}>
                {memorySegments}
            </div>
             <> <b>{usedMemory} / {totalMemory} MB ({percentage}%) </b> Memory Usage </>
        </div>
    );
};

export default MemoryManagement;
