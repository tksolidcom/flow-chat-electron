const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  ipcRenderer: ipcRenderer,
  receiveChannelName: (callback) => {
    ipcRenderer.on("channelOptions", (event, channelOptions) => {
      callback(channelOptions);
    });
  },
  changeFontSize: (callback) => {
    ipcRenderer.on("changeFontSize", (event, fontSize) => {
      callback(fontSize);
    });
  },
  changeColor: (callback) => {
    ipcRenderer.on("changeColor", (event, color) => {
      callback(color);
    });
  },
  updateChannelWindowOptions: (callback) => {
    ipcRenderer.on("updateChannelWindowOptions", (event, windowOptions) => {
      callback(windowOptions);
    });
  },
});
