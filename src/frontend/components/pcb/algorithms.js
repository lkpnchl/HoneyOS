export function firstInFirstOut(referenceString, frameNumber) {
    let pageInMem = [];
    let pageFaults = [];
    let pageInMemArray = [];
    let pageNotInMem = [];
    let pageNotInMemArray = [];
    let referenceMapArray = [];
    for (let i = 0; i < referenceString.length; i++) {
            //If the frames include the string, no page fault
            if (pageInMem.includes(referenceString[i])) {
                pageFaults.push('HIT');
            } else {
                //Page fault occurs
                pageFaults.push('F');
                //If there is free frame
                if (pageInMem.length < frameNumber) {
                    //add to the top of the array
                    pageInMem.unshift(referenceString[i]);
                } else {
                    if (pageNotInMem.length >= frameNumber) {
                        pageNotInMem.pop();
                    }
                    pageNotInMem.unshift(pageInMem.pop());
                    //insert the new page into the top of the array
                    pageInMem.unshift(referenceString[i]);
                }
            }
        pageInMemArray.push([...pageInMem]);
        pageNotInMemArray.push([...pageNotInMem]);
    }
    return {pageInMemArray, pageFaults, pageNotInMemArray, referenceMapArray};
}
