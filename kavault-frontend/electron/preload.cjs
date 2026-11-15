const { contextBridge } = require("electron");
const path = require("path");
const fs = require("fs");

let splashPath = path.join(__dirname, "../dist/splash.mp4");
// В упакованном asar медиафайлы распакованы в app.asar.unpacked
const unpackedPath = splashPath.replace("app.asar", "app.asar.unpacked");
if (fs.existsSync(unpackedPath)) {
  splashPath = unpackedPath;
}

const fileUrl = splashPath.startsWith("/")
  ? `file://${splashPath}`
  : `file:///${splashPath.replace(/\\/g, "/")}`;

contextBridge.exposeInMainWorld("kavaultDesktop", {
  platform: process.platform,
  isDesktop: true,
  splashPath: fileUrl,
});
