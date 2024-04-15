const fs = require('fs');

const openFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
    } else {
      console.log("File content:", data);
      // Here you can do whatever you want with the file content
    }
  });
}


module.exports = {
  openFile,
};