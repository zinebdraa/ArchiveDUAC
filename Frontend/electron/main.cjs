// const { app, BrowserWindow, ipcMain } = require('electron');
// const path = require('path');

// const isDev = !!process.env.VITE_DEV_SERVER_URL;

// function createWindow() {
//   const win = new BrowserWindow({
//      title: "Archive DUAC",
//   icon: path.join(__dirname, '../public/LogoWhite.png'),
//     width: 1100,
//     height: 720,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.cjs'),
//       contextIsolation: true,
//       nodeIntegration: false,
//       sandbox: false,
//     },
//   });

//   if (isDev) {
//     win.loadURL(process.env.VITE_DEV_SERVER_URL);
//     win.webContents.openDevTools();
//   } else {
//     win.loadFile(path.join(__dirname, '../dist/index.html'));
//   }
// }

// // simple IPC example
// ipcMain.handle('ping', () => 'pong');

// app.whenReady().then(() => {
//   createWindow();
//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });

// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const { spawn } = require("child_process");
// const isDev = process.env.NODE_ENV === "development";

// function startBackend() {
//   const serverPath = path.join(__dirname, "../Backend/server.js");
//   const serverProcess = spawn("node", [serverPath], {
//     cwd: path.join(__dirname, "../Backend"),
//   });

//   return serverProcess;
// }

// // Call this in your createWindow function
// let backendProcess;
// app.whenReady().then(() => {
//   backendProcess = startBackend();
//   setTimeout(createWindow, 3000); // Wait for backend to start
// });

// function createWindow() {
//   const mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   });

//   const startUrl = isDev
//     ? "http://localhost:5173"
//     : `file://${path.join(__dirname, "../dist/index.html")}`;

//   mainWindow.loadURL(startUrl);
// }

// app.whenReady().then(createWindow);

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });

// app.on("before-quit", () => {
//   if (backendProcess) {
//     backendProcess.kill();
//   }
// });
// electron/main.js - Updated version to properly handle backend

// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const { spawn } = require("child_process");
// const isDev = process.env.NODE_ENV === "development";

// let mainWindow;
// let serverProcess;

// // Start backend server
// // function startServer() {
// //   try {
// //     // In development, use regular node
// //     if (isDev) {
// //       const serverPath = path.join(__dirname, '../../Backend/server.js');
// //       serverProcess = spawn('node', [serverPath], {
// //         cwd: path.join(__dirname, '../../Backend'),
// //         stdio: 'inherit'
// //       });
// //     } else {
// //       // In production, use the bundled server
// //       const serverPath = path.join(process.resourcesPath, 'server', 'server.js');
// //       const nodePath = process.execPath; // Use the same node.exe that's running Electron

// //       serverProcess = spawn(nodePath, [serverPath], {
// //         cwd: path.join(process.resourcesPath, 'server'),
// //         stdio: 'inherit'
// //       });
// //     }

// //     serverProcess.on('error', (err) => {
// //       console.error('Failed to start server:', err);
// //     });

// //   } catch (error) {
// //     console.error('Error starting server:', error);
// //   }
// // }

// function startServer() {
//   return new Promise((resolve, reject) => {
//     try {
//       let serverPath, serverCwd, nodeCommand;

//       if (isDev) {
//         // Development mode
//         serverPath = path.join(__dirname, "../../Backend/server.js");
//         serverCwd = path.join(__dirname, "../../Backend");
//         nodeCommand = "node";
//       } else {
//         // Production mode - server is in extraResources
//         serverPath = path.join(process.resourcesPath, "server", "server.js");
//         serverCwd = path.join(process.resourcesPath, "server");
//         nodeCommand = process.execPath; // Use Electron's node
//       }

//       console.log("Starting server from:", serverPath);
//       console.log("Server CWD:", serverCwd);

//       serverProcess = spawn(nodeCommand, [serverPath], {
//         cwd: serverCwd,
//         stdio: ["pipe", "pipe", "pipe"],
//         env: { ...process.env, NODE_ENV: "production" },
//       });

//       // Log server output
//       serverProcess.stdout.on("data", (data) => {
//         console.log("Server:", data.toString());
//       });

//       serverProcess.stderr.on("data", (data) => {
//         console.error("Server Error:", data.toString());
//       });

//       serverProcess.on("error", (err) => {
//         console.error("Failed to start server process:", err);
//         reject(err);
//       });

//       serverProcess.on("spawn", () => {
//         console.log("Server process spawned successfully");
//         resolve();
//       });

//       // Give server time to start
//       setTimeout(() => {
//         if (serverProcess && !serverProcess.killed) {
//           resolve();
//         }
//       }, 3000);
//     } catch (error) {
//       console.error("Error in startServer:", error);
//       reject(error);
//     }
//   });
// }

// function createWindow() {
//   mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   });

//   // Load the frontend
//   const startUrl = isDev
//     ? "http://localhost:5173"
//     : `file://${path.join(__dirname, "../dist/index.html")}`;

//   console.log("Loading frontend from:", startUrl);
//   mainWindow.loadURL(startUrl);

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });
// }

// // app.whenReady().then(() => {
// //   // Start server first, then create window after delay
// //   startServer();
// //   setTimeout(createWindow, 3000); // Give server time to start
// // });

// app.whenReady().then(async () => {
//   try {
//     console.log('Starting backend server...');
//     await startServer();
//     console.log('Backend started, creating window...');
//     createWindow();
//   } catch (error) {
//     console.error('Failed to start backend:', error);
//     // Create window anyway to show error
//     createWindow();
//   }
// });

// app.on("window-all-closed", () => {
//   // Kill server process when app closes
//   if (serverProcess) {
//     serverProcess.kill();
//   }

//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("before-quit", () => {
//   if (serverProcess) {
//     serverProcess.kill();
//   }
// });

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });
// electron/main.js - Fixed version to prevent infinite windows
const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");
const isDev = process.env.NODE_ENV === "development";

let mainWindow;
let serverProcess;
let isServerStarted = false;
let isAppReady = false;

function startServer() {
  return new Promise((resolve, reject) => {
    if (isServerStarted) {
      resolve();
      return;
    }

    try {
      let serverPath, serverCwd, nodeCommand;

      if (isDev) {
        serverPath = path.join(__dirname, "../../Backend/server.js");
        serverCwd = path.join(__dirname, "../../Backend");
        nodeCommand = "node";
      } else {
        serverPath = path.join(process.resourcesPath, "server", "server.js");
        serverCwd = path.join(process.resourcesPath, "server");
        nodeCommand = process.execPath;
      }

      console.log("Starting server from:", serverPath);
      console.log("Server CWD:", serverCwd);

      serverProcess = spawn(nodeCommand, [serverPath], {
        cwd: serverCwd,
        stdio: ["pipe", "pipe", "pipe"],
        env: { ...process.env, NODE_ENV: "production" },
      });

      serverProcess.stdout.on("data", (data) => {
        console.log("Server:", data.toString());
      });

      serverProcess.stderr.on("data", (data) => {
        console.error("Server Error:", data.toString());
      });

      serverProcess.on("error", (err) => {
        console.error("Failed to start server process:", err);
        reject(err);
      });

      serverProcess.on("spawn", () => {
        console.log("Server process spawned successfully");
        isServerStarted = true;
        resolve();
      });

      // Timeout fallback
      setTimeout(() => {
        if (serverProcess && !serverProcess.killed) {
          isServerStarted = true;
          resolve();
        } else {
          reject(new Error("Server failed to start within timeout"));
        }
      }, 5000);
    } catch (error) {
      console.error("Error in startServer:", error);
      reject(error);
    }
  });
}

function createWindow() {
  // Prevent multiple windows
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until ready
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    },
  });

  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  console.log("Loading frontend from:", startUrl);
  
  // Show window when ready to prevent flashing
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.loadURL(startUrl);

  // Open DevTools only in development or for debugging
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Single app ready handler
app.whenReady().then(async () => {
  if (isAppReady) return; // Prevent multiple calls
  isAppReady = true;

  try {
    console.log('App is ready, starting backend server...');
    await startServer();
    console.log('Backend started successfully, creating window...');
    createWindow();
  } catch (error) {
    console.error('Failed to start backend:', error);
    // Still create window to show the app (user can see the error)
    createWindow();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on("window-all-closed", () => {
  if (serverProcess) {
    console.log("Killing server process...");
    serverProcess.kill("SIGTERM");
    serverProcess = null;
    isServerStarted = false;
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
    serverProcess = null;
    isServerStarted = false;
  }
});

app.on("activate", () => {
  // On macOS, re-create window when dock icon is clicked
  if (BrowserWindow.getAllWindows().length === 0 && isAppReady) {
    createWindow();
  }
});