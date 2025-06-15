document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("video");
  const canvas = document.getElementById("canvas");
  const captureBtn = document.getElementById("captureBtn");
  const saveBtn = document.getElementById("saveBtn");
  const retakeBtn = document.getElementById("retakeBtn");
  const minimizeBtn = document.getElementById("minimizeBtn");
  const closeBtn = document.getElementById("closeBtn");
  const capturedImageContainer = document.getElementById("capturedImageContainer");
  const capturedImage = document.getElementById("capturedImage");
  const cameraControls = document.getElementById("camera-controls");
  console.log('camera locked in');

  // Function to capture image
  const captureImage = () => {
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    capturedImage.src = imageData;
    capturedImageContainer.classList.remove("hidden");
    video.classList.add("hidden");
    cameraControls.classList.add("hidden");
    canvas.classList.add("hidden");
  };

  // Access the camera
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((err) => {
      console.error("Error accessing the camera:", err);
    });

  // Capture the image
  captureBtn.addEventListener("click", captureImage);

  // Listen for capture photo command from voice recognition
  if (window.electron && window.electron.ipcRenderer) {
    window.electron.ipcRenderer.on('capture-photo', () => {
      console.log('Received capture photo command from voice recognition');
      captureImage();
    });
  }

  // Save the image
  saveBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.href = capturedImage.src;
    link.download = "captured-image.png";
    link.click();
  });

  // Retake the image
  retakeBtn.addEventListener("click", () => {
    capturedImageContainer.classList.add("hidden");
    cameraControls.classList.add("hidden");
    // Show the video and "Capture" button
    video.classList.remove("hidden");
    canvas.classList.remove("hidden");
  });

  // Minimize the camera window
  minimizeBtn.addEventListener("click", () => {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send("minimize-camera");
    } else {
      console.error("Electron IPC not available");
    }
  });

  // Close the camera window
  closeBtn.addEventListener("click", () => {
    if (window.electron && window.electron.ipcRenderer) {
      console.log('Sending close-camera event')
      window.electron.ipcRenderer.send("close-camera");
    } else {
      console.error("Electron IPC not available");
    }
  });
});