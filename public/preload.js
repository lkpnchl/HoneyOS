const { contextBridge, ipcRenderer } = require('electron');
console.log('Preload script loaded');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    send: (channel, ...args) => ipcRenderer.send(channel, ...args),
    on: (channel, listener) => ipcRenderer.on(channel, listener),
    once: (channel, listener) => ipcRenderer.once(channel, listener),
  },
  onVoiceServerPort: (callback) => {
    ipcRenderer.on('voice-server-port', (event, port) => callback(port));
  },
  requestVoiceServerPort: () => {
    ipcRenderer.send('get-voice-server-port');
  }
});
