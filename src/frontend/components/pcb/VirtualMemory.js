import React, { useState } from "react";
import Header from "./component/header";
import Tables from "./component/tables";
import { refStringGen } from "./randomRefStringGen";
import List from "./component/list";
import { firstInFirstOut } from "./algorithms";

const VirtualMemory = () => {
  const [referenceInputTextField, setReferenceInputTextField] = useState("2,3,4,5,6,2,7,8");
  const [referenceString, setReferenceString] = useState(["2", "3", "4", "5", "6", "2", "7", "8"]);
  const [frameNumber, setFrameNumber] = useState(5);
  const [resetTurns, setResetTurns] = useState(4);
  const [jobProcessID, setJobProcessID] = useState("");
  const [memorySize, setMemorySize] = useState("");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState({ name: "First In First Out" });
  
  const handleRefChange = ({ target }) => {
    const { value } = target;
    if (
      value.match(/^$|^[0-9,]+$/) &&
      !value.match(/,,+,*|[0-9][0-9]+[0-9]*/g)
    ) {
      const tempReferenceString = [...value.split(",")];
      const filteredReferenceString = tempReferenceString.filter(
        (value) => value !== ""
      );
      
      setReferenceInputTextField(value);
      setReferenceString(filteredReferenceString);
    }
  };

  const handleFrameChange = ({ target }) => {
    if ((target.value <= 7 && target.value >= 3) || target.value === 0) {
      setFrameNumber(target.value);
    }
  };

  const handleResetTurnsChange = ({ target }) => {
    if (target.value <= 9 && target.value >= 0) {
      setResetTurns(target.value);
    }
  };

  const handleRefStringGenClick = () => {
    const tempReferenceStringInput = refStringGen(24, 9);
    const tempReferenceString = [...tempReferenceStringInput.split(",")];
    const filteredReferenceString = tempReferenceString.filter(
      (value) => value !== ""
    );
    
    setReferenceInputTextField(tempReferenceStringInput);
    setReferenceString(filteredReferenceString);
  };

  const handleJobProcessIDChange = ({ target }) => {
    const { value } = target;
    // Ensure that only integer values are accepted for Job Process ID
    if (value.match(/^\d*$/)) {
      setJobProcessID(value);
    }
  };

  const handleMemorySizeChange = ({ target }) => {
    const { value } = target;
    // Ensure that only integer values are accepted for Memory Size
    if (value.match(/^\d*$/)) {
      setMemorySize(value);
    }
  };

  const handleListChange = (algorithm) => {
    setSelectedAlgorithm(algorithm);
  };

  const algorithms = [{ name: "First In First Out", f: firstInFirstOut }];
  const filteredAlgorithm =
    selectedAlgorithm && selectedAlgorithm["f"]
      ? algorithms.filter((a) => a["name"] === selectedAlgorithm["name"])
      : algorithms.filter((a) => a["name"] !== "Show All");

  return (
    <main className="container">
      <div className="row">
        <div className="col">
          <Header
            handleRefChange={handleRefChange}
            handleFrameChange={handleFrameChange}
            handleResetTurnsChange={handleResetTurnsChange}
            handleRefStringGenClick={handleRefStringGenClick}
            handleJobProcessIDChange={handleJobProcessIDChange}
            handleMemorySizeChange={handleMemorySizeChange}
            frameNumber={frameNumber}
            resetTurns={resetTurns}
            referenceInputTextField={referenceInputTextField}
            jobProcessID={jobProcessID}
            memorySize={memorySize}
          />
        </div>
        <div className="col-3 mt-2 list-group-outer-padding">
          <List
            algorithms={algorithms}
            handleListChange={handleListChange}
            selectedAlgorithm={selectedAlgorithm}
          />
        </div>
      </div>
      <div>
        <Tables
          frameNumber={frameNumber}
          resetTurns={resetTurns}
          referenceString={referenceString}
          jobProcessID={jobProcessID}
          memorySize={memorySize}
          algorithms={filteredAlgorithm}
        />
      </div>
    </main>
  );
};

export default VirtualMemory;
