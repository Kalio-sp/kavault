const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("kavaultDesktop", {
  platform: process.platform,
  isDesktop: true,
});
