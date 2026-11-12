const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 840,
    minWidth: 960,
    minHeight: 640,
    title: "KAVAULT — Personal Knowledge & Learning Engine",
    backgroundColor: "#09090b",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "../public/icon.png"),
  });

  // Открытие окна только когда готов контент
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  const indexPath = path.join(__dirname, "../dist/index.html");

  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173").catch(() => {
      mainWindow.loadFile(indexPath);
    });
  } else {
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error("Ошибка загрузки dist/index.html:", err);
      mainWindow.loadURL("http://localhost:5173");
    });
  }

  // F12 для вызова DevTools при необходимости
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
    }
  });

  // Внешние ссылки открывать в браузере по умолчанию
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
