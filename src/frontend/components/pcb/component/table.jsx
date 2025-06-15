import React, { Component } from "react";
import _ from "lodash";
import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

export default class TableVM extends Component {
  state = {
    currentIndex: 0,
  };

  componentDidMount() {
    this.interval = setInterval(this.updateIndex, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateIndex = () => {
    const { referenceString } = this.props;
    const { currentIndex } = this.state;
    const nextIndex = (currentIndex + 1) % referenceString.length;
    if (nextIndex === 0) {
      clearInterval(this.interval);
    } else {
      this.setState({ currentIndex: nextIndex });
    }
  };

  // Define a function to generate color palette
  generateColorPalette = () => {
    const excludedColors = ["#006400", "#FF0000"]; // Green and Red
    const availableColors = [
      "#C1B6A3", // Light brown
      "#FFCC99", // Light orange
      "#FFD699", // Light yellow
      "#FFE6CC", // Light peach
      "#CCFFFF", // Light cyan
      "#99CCFF", // Light blue
      "#CCCCFF", // Light lavender
      "#FFCCFF", // Light pink
      "#FFFF99", // Light yellow
    ];
    const colors = availableColors.filter(color => !excludedColors.includes(color));
    return colors;
  };

  // Define a function to generate a random memory size
  generateRandomMemorySize = () => {
    const minSize = 1;
    const maxSize = 100; // Adjust as needed for realistic memory sizes
    return Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
  };

  render() {
    const {
      referenceString,
      frameNumber,
      algorithmLabel,
      algorithm,
      resetTurns,
      jobProcessID,
      memorySize // Retrieve jobProcessID and memorySize from props
    } = this.props;
    const { currentIndex } = this.state;
    const { pageInMemArray, pageFaults, pageNotInMemArray } = algorithm(
      referenceString,
      frameNumber,
      resetTurns
    );
    const frameNumberArray = _.range(0, frameNumber, 1);
    const colorPalette = this.generateColorPalette();

    return (
      <div>
        <Table>
          <TableCaption></TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Job Process ID</TableHead>
              <TableHead>Memory Size</TableHead>
              <TableHead>Reference String</TableHead>
              <TableHead>Working Set</TableHead>
              <TableHead>Swapped Memory</TableHead>
              <TableHead>Page Fault</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">{jobProcessID}</TableCell> {/* Display Job Process ID */}
              <TableCell>{memorySize}</TableCell> {/* Display Memory Size */}
              <TableCell className="font-medium">{referenceString[currentIndex]}</TableCell>
              <TableCell>
                {pageInMemArray[currentIndex].map((frame, frameIdx) => (
                  <TableCell
                    key={frameIdx}
                    style={{
                      backgroundColor: colorPalette[frame % colorPalette.length],
                    }}
                  >
                    {frame}
                  </TableCell>
                ))}
              </TableCell>
              <TableCell>
                {pageNotInMemArray[currentIndex].map((frame, frameIdx) => (
                  <TableCell
                    key={frameIdx}
                    style={{
                      backgroundColor:
                        frameIdx === 0
                          ? colorPalette[frame % colorPalette.length]
                          : "#D3D3D3", // Gray background for values after the leftmost
                    }}
                  >
                    {frame}
                  </TableCell>
                ))}
              </TableCell>
              <TableCell>
              <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {pageFaults[currentIndex] === "F" ? (
                    <span style={{ color: "#FF0000" }}>{pageFaults[currentIndex]}</span>
                  ) : (
                    <span style={{ color: "#006400" }}>{pageFaults[currentIndex]}</span>
                  )}
                </motion.div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}
