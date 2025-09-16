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
// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const { spawn } = require("child_process");
// const isDev = process.env.NODE_ENV === "development";

// let mainWindow;
// let serverProcess;
// let isServerStarted = false;
// let isAppReady = false;

// function startServer() {
//   return new Promise((resolve, reject) => {
//     if (isServerStarted) {
//       resolve();
//       return;
//     }

//     try {
//       let serverPath, serverCwd, nodeCommand;

//       if (isDev) {
//         serverPath = path.join(__dirname, "../../Backend/server.js");
//         serverCwd = path.join(__dirname, "../../Backend");
//         nodeCommand = "node";
//       } else {
//         serverPath = path.join(process.resourcesPath, "server", "server.js");
//         serverCwd = path.join(process.resourcesPath, "server");
//         nodeCommand = process.execPath;
//       }

//       console.log("Starting server from:", serverPath);
//       console.log("Server CWD:", serverCwd);

//       serverProcess = spawn(nodeCommand, [serverPath], {
//         cwd: serverCwd,
//         stdio: ["pipe", "pipe", "pipe"],
//         env: { ...process.env, NODE_ENV: "production" },
//       });

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
//         isServerStarted = true;
//         resolve();
//       });

//       // Timeout fallback
//       setTimeout(() => {
//         if (serverProcess && !serverProcess.killed) {
//           isServerStarted = true;
//           resolve();
//         } else {
//           reject(new Error("Server failed to start within timeout"));
//         }
//       }, 5000);
//     } catch (error) {
//       console.error("Error in startServer:", error);
//       reject(error);
//     }
//   });
// }

// function createWindow() {
//   // Prevent multiple windows
//   if (mainWindow) {
//     mainWindow.focus();
//     return;
//   }

//   mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     show: false, // Don't show until ready
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       webSecurity: false
//     },
//   });

//   const startUrl = isDev
//     ? "http://localhost:5173"
//     : `file://${path.join(__dirname, "../dist/index.html")}`;

//   console.log("Loading frontend from:", startUrl);

//   // Show window when ready to prevent flashing
//   mainWindow.once('ready-to-show', () => {
//     mainWindow.show();
//   });

//   mainWindow.loadURL(startUrl);

//   // Open DevTools only in development or for debugging
//   if (isDev) {
//     mainWindow.webContents.openDevTools();
//   }

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });
// }

// // Single app ready handler
// app.whenReady().then(async () => {
//   if (isAppReady) return; // Prevent multiple calls
//   isAppReady = true;

//   try {
//     console.log('App is ready, starting backend server...');
//     await startServer();
//     console.log('Backend started successfully, creating window...');
//     createWindow();
//   } catch (error) {
//     console.error('Failed to start backend:', error);
//     // Still create window to show the app (user can see the error)
//     createWindow();
//   }
// });

// // Prevent multiple instances
// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', () => {
//     // Someone tried to run a second instance, focus our window instead
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       mainWindow.focus();
//     }
//   });
// }

// app.on("window-all-closed", () => {
//   if (serverProcess) {
//     console.log("Killing server process...");
//     serverProcess.kill("SIGTERM");
//     serverProcess = null;
//     isServerStarted = false;
//   }

//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("before-quit", () => {
//   if (serverProcess) {
//     serverProcess.kill("SIGTERM");
//     serverProcess = null;
//     isServerStarted = false;
//   }
// });

// app.on("activate", () => {
//   // On macOS, re-create window when dock icon is clicked
//   if (BrowserWindow.getAllWindows().length === 0 && isAppReady) {
//     createWindow();
//   }
// });

// electron/main.js - Integrated Backend Approach (RECOMMENDED)
// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const express = require("express");
// const cors = require("cors");
// const isDev = process.env.NODE_ENV === "development";

// let mainWindow;
// let server;
// let isServerStarted = false;
// let isAppReady = false;

// function startIntegratedServer() {
//   return new Promise((resolve, reject) => {
//     if (isServerStarted) {
//       resolve();
//       return;
//     }

//     try {
//       const app = express();
//       const PORT = 3001;

//       // Middleware
//       app.use(cors({
//         origin: ['http://localhost:5173', 'file://'],
//         credentials: true
//       }));
//       app.use(express.json());

//       try {

//         const authRoutes = require('./backend-modules/routes/auth');
//         const servicesRoutes = require('./backend-modules/routes/services');
//         const bureauxRoutes = require('./backend-modules/routes/bureaux');
//         const chemisesRoutes = require('./backend-modules/routes/chemises');
//         const documentsRoutes = require('./backend-modules/routes/documents');
//         const usersRoutes = require('./backend-modules/routes/users');

//         // Setup routes
//         expressApp.use('/api/auth', authRoutes);
//         expressApp.use('/api/services', servicesRoutes);
//         expressApp.use('/api/bureaus', bureauxRoutes);
//         expressApp.use('/api/chemises', chemisesRoutes);
//         expressApp.use('/api/documents', documentsRoutes);
//         expressApp.use('/api/users', usersRoutes);

//       }catch (routeError) {
//         console.error('Error loading routes:', routeError);

//         // Fallback: Create basic routes manually
//         setupFallbackRoutes(expressApp);
//       }

//       app.get('/api/test', (req, res) => {
//         res.json({ message: 'Integrated backend is running!' });
//       });

//       // Auth routes example
//       app.post('/api/auth/login', (req, res) => {
//         // Your login logic here
//         console.log('Login attempt:', req.body);
//         res.json({ success: true, message: 'Login endpoint working' });
//       });

//       // Start server
//       server = app.listen(PORT, '127.0.0.1', () => {
//         console.log(`Integrated backend running on http://127.0.0.1:${PORT}`);
//         isServerStarted = true;
//         resolve();
//       });

//       server.on('error', (err) => {
//         console.error('Server error:', err);
//         reject(err);
//       });

//     } catch (error) {
//       console.error('Error starting integrated server:', error);
//       reject(error);
//     }
//   });
// }

// function createWindow() {
//   // Prevent multiple windows
//   if (mainWindow) {
//     mainWindow.focus();
//     return;
//   }

//   mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     show: false,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       webSecurity: false
//     },
//   });

//   const startUrl = isDev
//     ? "http://localhost:5173"
//     : `file://${path.join(__dirname, "../dist/index.html")}`;

//   console.log("Loading frontend from:", startUrl);

//   mainWindow.once('ready-to-show', () => {
//     mainWindow.show();
//   });

//   mainWindow.loadURL(startUrl);

//   // Open DevTools to see if backend is working
//   if (isDev) {
//     mainWindow.webContents.openDevTools();
//   }

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });
// }

// app.whenReady().then(async () => {
//   if (isAppReady) return;
//   isAppReady = true;

//   try {
//     console.log('Starting integrated backend...');
//     await startIntegratedServer();
//     console.log('Backend started successfully, creating window...');
//     createWindow();
//   } catch (error) {
//     console.error('Failed to start integrated backend:', error);
//     createWindow();
//   }
// });

// // Prevent multiple instances
// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', () => {
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       mainWindow.focus();
//     }
//   });
// }

// app.on("window-all-closed", () => {
//   if (server) {
//     console.log("Closing integrated server...");
//     server.close(() => {
//       console.log("Server closed");
//     });
//     server = null;
//     isServerStarted = false;
//   }

//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0 && isAppReady) {
//     createWindow();
//   }
// });
// electron/main.js - Complete Integrated Backend
// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const express = require("express");
// const cors = require("cors");
// const isDev = process.env.NODE_ENV === "development";

// let mainWindow;
// let server;
// let isServerStarted = false;
// let isAppReady = false;

// function startIntegratedServer() {
//   return new Promise((resolve, reject) => {
//     if (isServerStarted) {
//       resolve();
//       return;
//     }

//     try {
//       const expressApp = express();
//       const PORT = 3001;

//       // Middleware
//       expressApp.use(cors({
//         origin: ['http://localhost:5173', 'file://'],
//         credentials: true
//       }));
//       expressApp.use(express.json());

//       // Import and setup your actual backend routes
//       try {
//         // Import your route files
//         const authRoutes = require('./backend-modules/routes/auth');
//         const servicesRoutes = require('./backend-modules/routes/services');
//         const bureauxRoutes = require('./backend-modules/routes/bureaux');
//         const chemisesRoutes = require('./backend-modules/routes/chemises');
//         const documentsRoutes = require('./backend-modules/routes/documents');
//         const usersRoutes = require('./backend-modules/routes/users');

//         // Setup routes
//         expressApp.use('/api/auth', authRoutes);
//         expressApp.use('/api/services', servicesRoutes);
//         expressApp.use('/api/bureaus', bureauxRoutes);
//         expressApp.use('/api/chemises', chemisesRoutes);
//         expressApp.use('/api/documents', documentsRoutes);
//         expressApp.use('/api/users', usersRoutes);

//         console.log('All routes loaded successfully');
//       } catch (routeError) {
//         console.error('Error loading routes:', routeError);

//         // Fallback: Create basic routes manually
//         setupFallbackRoutes(expressApp);
//       }

//       // Test route
//       expressApp.get('/api/test', (req, res) => {
//         res.json({ message: 'Integrated backend is running!', timestamp: new Date() });
//       });

//       // Start server
//       server = expressApp.listen(PORT, '127.0.0.1', () => {
//         console.log(`Integrated backend running on http://127.0.0.1:${PORT}`);
//         isServerStarted = true;
//         resolve();
//       });

//       server.on('error', (err) => {
//         console.error('Server error:', err);
//         reject(err);
//       });

//     } catch (error) {
//       console.error('Error starting integrated server:', error);
//       reject(error);
//     }
//   });
// }

// // Fallback routes if route files can't be loaded
// function setupFallbackRoutes(app) {
//   console.log('Setting up fallback routes...');

//   const sqlite3 = require('sqlite3').verbose();
//   const dbPath = path.join(__dirname, 'database.sqlite');
//   const db = new sqlite3.Database(dbPath);

//   // Services routes
//   app.get('/api/services', (req, res) => {
//     db.all('SELECT * FROM services', (err, rows) => {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json(rows);
//       }
//     });
//   });

//   app.post('/api/services', (req, res) => {
//     const { nom } = req.body;
//     db.run('INSERT INTO services (nom) VALUES (?)', [nom], function(err) {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json({ id: this.lastID, nom });
//       }
//     });
//   });

//   // Bureaux routes
//   app.get('/api/bureaus', (req, res) => {
//     db.all('SELECT * FROM bureaux', (err, rows) => {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json(rows);
//       }
//     });
//   });

//   app.post('/api/bureaus', (req, res) => {
//     const { nom, service_id } = req.body;
//     db.run('INSERT INTO bureaux (nom, service_id) VALUES (?, ?)', [nom, service_id], function(err) {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json({ id: this.lastID, nom, service_id });
//       }
//     });
//   });

//   // Chemises routes
//   app.get('/api/chemises', (req, res) => {
//     db.all('SELECT * FROM chemises', (err, rows) => {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json(rows);
//       }
//     });
//   });

//   app.post('/api/chemises', (req, res) => {
//     const { numero, nom, bureau_id } = req.body;
//     db.run('INSERT INTO chemises (numero, nom, bureau_id) VALUES (?, ?, ?)', [numero, nom, bureau_id], function(err) {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json({ id: this.lastID, numero, nom, bureau_id });
//       }
//     });
//   });

//   // Documents routes
//   app.get('/api/documents', (req, res) => {
//     db.all('SELECT * FROM documents', (err, rows) => {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json(rows);
//       }
//     });
//   });

//   app.post('/api/documents', (req, res) => {
//     const { nom, type, chemin, chemise_id } = req.body;
//     db.run('INSERT INTO documents (nom, type, chemin, chemise_id) VALUES (?, ?, ?, ?)', [nom, type, chemin, chemise_id], function(err) {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json({ id: this.lastID, nom, type, chemin, chemise_id });
//       }
//     });
//   });

//   // Users routes
//   app.get('/api/users', (req, res) => {
//     db.all('SELECT * FROM users', (err, rows) => {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json(rows);
//       }
//     });
//   });

//   app.post('/api/users', (req, res) => {
//     const { nom, type, chemin, chemise_id } = req.body;
//     db.run('INSERT INTO users (nom, email, password, phone) VALUES (?, ?, ?, ?)', [nom, type, chemin, chemise_id], function(err) {
//       if (err) {
//         console.error('Database error:', err);
//         res.status(500).json({ error: err.message });
//       } else {
//         res.json({ id: this.lastID, nom, email, password, phone });
//       }
//     });
//   });

//   console.log('Fallback routes setup complete');
// }

// function createWindow() {
//   if (mainWindow) {
//     mainWindow.focus();
//     return;
//   }

//   mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     show: false,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       webSecurity: false
//     },
//   });

//   const startUrl = isDev
//     ? "http://localhost:5173"
//     : `file://${path.join(__dirname, "../dist/index.html")}`;

//   console.log("Loading frontend from:", startUrl);

//   mainWindow.once('ready-to-show', () => {
//     mainWindow.show();
//   });

//   mainWindow.loadURL(startUrl);

//   // Open DevTools to monitor API calls
//   if (isDev || !isServerStarted) {
//     mainWindow.webContents.openDevTools();
//   }

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });
// }

// app.whenReady().then(async () => {
//   if (isAppReady) return;
//   isAppReady = true;

//   try {
//     console.log('Starting integrated backend...');
//     await startIntegratedServer();
//     console.log('Backend started successfully, creating window...');
//     createWindow();
//   } catch (error) {
//     console.error('Failed to start integrated backend:', error);
//     createWindow();
//   }
// });

// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', () => {
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       mainWindow.focus();
//     }
//   });
// }

// app.on("window-all-closed", () => {
//   if (server) {
//     console.log("Closing integrated server...");
//     server.close(() => {
//       console.log("Server closed");
//     });
//     server = null;
//     isServerStarted = false;
//   }

//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0 && isAppReady) {
//     createWindow();
//   }
// });
// electron/main.js - Integrated Backend Approach (RECOMMENDED)
// const { app, BrowserWindow } = require("electron");
// const path = require("path");
// const express = require("express");
// const cors = require("cors");
// const isDev = process.env.NODE_ENV === "development";

// let mainWindow;
// let server;
// let isServerStarted = false;
// let isAppReady = false;

// function startIntegratedServer() {
//   return new Promise((resolve, reject) => {
//     if (isServerStarted) {
//       resolve();
//       return;
//     }

//     try {
//       const app = express();
//       const PORT = 3001;

//       // Middleware
//       app.use(cors({
//         origin: ['http://localhost:5173', 'file://'],
//         credentials: true
//       }));
//       app.use(express.json());

//       // Import and setup your backend routes
//       // You'll need to copy these from your Backend folder

//       // Example routes - replace with your actual routes
//       app.get('/api/test', (req, res) => {
//         res.json({ message: 'Integrated backend is running!' });
//       });

//       // Auth routes example
//       app.post('/api/auth/login', (req, res) => {
//         // Your login logic here
//         console.log('Login attempt:', req.body);
//         res.json({ success: true, message: 'Login endpoint working' });
//       });

//       // Start server
//       server = app.listen(PORT, '127.0.0.1', () => {
//         console.log(`Integrated backend running on http://127.0.0.1:${PORT}`);
//         isServerStarted = true;
//         resolve();
//       });

//       server.on('error', (err) => {
//         console.error('Server error:', err);
//         reject(err);
//       });

//     } catch (error) {
//       console.error('Error starting integrated server:', error);
//       reject(error);
//     }
//   });
// }

// function createWindow() {
//   // Prevent multiple windows
//   if (mainWindow) {
//     mainWindow.focus();
//     return;
//   }

//   mainWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     show: false,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//       webSecurity: false
//     },
//   });

//   const startUrl = isDev
//     ? "http://localhost:5173"
//     : `file://${path.join(__dirname, "../dist/index.html")}`;

//   console.log("Loading frontend from:", startUrl);

//   mainWindow.once('ready-to-show', () => {
//     mainWindow.show();
//   });

//   mainWindow.loadURL(startUrl);

//   // Open DevTools to see if backend is working
//   if (isDev) {
//     mainWindow.webContents.openDevTools();
//   }

//   mainWindow.on("closed", () => {
//     mainWindow = null;
//   });
// }

// app.whenReady().then(async () => {
//   if (isAppReady) return;
//   isAppReady = true;

//   try {
//     console.log('Starting integrated backend...');
//     await startIntegratedServer();
//     console.log('Backend started successfully, creating window...');
//     createWindow();
//   } catch (error) {
//     console.error('Failed to start integrated backend:', error);
//     createWindow();
//   }
// });

// // Prevent multiple instances
// const gotTheLock = app.requestSingleInstanceLock();

// if (!gotTheLock) {
//   app.quit();
// } else {
//   app.on('second-instance', () => {
//     if (mainWindow) {
//       if (mainWindow.isMinimized()) mainWindow.restore();
//       mainWindow.focus();
//     }
//   });
// }

// app.on("window-all-closed", () => {
//   if (server) {
//     console.log("Closing integrated server...");
//     server.close(() => {
//       console.log("Server closed");
//     });
//     server = null;
//     isServerStarted = false;
//   }

//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0 && isAppReady) {
//     createWindow();
//   }
// });
const { app, BrowserWindow } = require("electron");
const path = require("path");
const express = require("express");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");

const isDev = process.env.NODE_ENV === "development";



// Import your database
const db = require("./backend-modules/db.js");

let mainWindow;
let server;
let isServerStarted = false;
let isAppReady = false;

// JWT Secret - in production, use environment variable
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production";

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    req.user = user;
    next();
  });
};

function startIntegratedServer() {
  return new Promise((resolve, reject) => {
    if (isServerStarted) {
      resolve();
      return;
    }

    try {
      const expressApp = express();
      const PORT = 3001;

      // Middleware
      expressApp.use(
        cors({
          origin: ["http://localhost:5173", "file://"],
          credentials: true,
        })
      );
      expressApp.use(express.json({ limit: "50mb" }));
      expressApp.use(express.urlencoded({ limit: "50mb", extended: true }));

      // ============ AUTH ROUTES ============

      // Register user
      expressApp.post("/api/auth/register", async (req, res) => {
        try {
          const { user_name, user_email, user_num, password } = req.body;

          if (!user_name || !user_email || !user_num || !password) {
            return res.status(400).json({ error: "All fields are required" });
          }

          // Hash password
          const saltRounds = 10;
          const hashedPassword = await bcryptjs.hash(password, saltRounds);

          // Insert user into database
          const stmt = db.prepare(`
            INSERT INTO users (user_name, user_email, user_num, password)
            VALUES (?, ?, ?, ?)
          `);

          const result = stmt.run(
            user_name,
            user_email,
            user_num,
            hashedPassword
          );

          res.status(201).json({
            message: "User registered successfully",
            userId: result.lastInsertRowid,
          });
        } catch (error) {
          console.error("Registration error:", error);
          if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            res.status(409).json({ error: "Username or email already exists" });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
      });

      // Login user
      expressApp.post("/api/auth/login", async (req, res) => {
        try {
          const { password } = req.body;

          if (!password) {
            return res.status(400).json({ error: "password is required" });
          }

          const user = db.prepare("SELECT * FROM users LIMIT 1").get();

          if (!user) {
            return res
              .status(401)
              .json({
                error: "No user found. Please set up the system first.",
              });
          }

          // Verify password
          const isValidPassword = await bcryptjs.compare(
            password,
            user.password
          );

          if (!isValidPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
          }

          // Create JWT token
          const token = jwt.sign(
            { userId: user.id_user, email: user.user_email },
            JWT_SECRET,
            { expiresIn: "24h" }
          );

          res.json({
            message: "Login successful",
            token,
            user: {
              id: user.id_user,
              name: user.user_name,
              email: user.user_email,
              phone: user.user_num,
            },
          });
        } catch (error) {
          console.error("Login error:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });

      // ============ SERVICES ROUTES ============

      // Get all services
      expressApp.get("/api/services", authenticateToken, (req, res) => {
        try {
          const services = db
            .prepare("SELECT * FROM services ORDER BY sCreatedDate DESC")
            .all();
          res.json(services);
        } catch (error) {
          console.error("Error fetching services:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });

      // Create service
      expressApp.post("/api/services", authenticateToken, (req, res) => {
        try {
          const { service_name, service_place, sDescription } = req.body;

          if (!service_name || !service_place) {
            return res
              .status(400)
              .json({ error: "Service name and place are required" });
          }

          const stmt = db.prepare(`
            INSERT INTO services (service_name, service_place, sDescription)
            VALUES (?, ?, ?)
          `);

          const result = stmt.run(
            service_name,
            service_place,
            sDescription || null
          );

          res.status(201).json({
            message: "Service created successfully",
            serviceId: result.lastInsertRowid,
          });
        } catch (error) {
          console.error("Error creating service:", error);
          if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
            res
              .status(409)
              .json({ error: "Service name or place already exists" });
          } else {
            res.status(500).json({ error: "Internal server error" });
          }
        }
      });

      // ============ BUREAUS ROUTES ============

      // Get bureaus by service
      expressApp.get(
        "/api/services/:serviceId/bureaus",
        authenticateToken,
        (req, res) => {
          try {
            const { serviceId } = req.params;
            const bureaus = db
              .prepare(
                "SELECT * FROM bureaus WHERE service_id = ? ORDER BY bCreatedDate DESC"
              )
              .all(serviceId);
            res.json(bureaus);
          } catch (error) {
            console.error("Error fetching bureaus:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        }
      );

      // Create bureau
      expressApp.post(
        "/api/services/:serviceId/bureaus",
        authenticateToken,
        (req, res) => {
          try {
            const { serviceId } = req.params;
            const { bureau_name, bureau_place, bDescription } = req.body;

            if (!bureau_name || !bureau_place) {
              return res
                .status(400)
                .json({ error: "Bureau name and place are required" });
            }

            const stmt = db.prepare(`
            INSERT INTO bureaus (bureau_name, bureau_place, bDescription, service_id)
            VALUES (?, ?, ?, ?)
          `);

            const result = stmt.run(
              bureau_name,
              bureau_place,
              bDescription || null,
              serviceId
            );

            res.status(201).json({
              message: "Bureau created successfully",
              bureauId: result.lastInsertRowid,
            });
          } catch (error) {
            console.error("Error creating bureau:", error);
            if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
              res
                .status(409)
                .json({ error: "Bureau name or place already exists" });
            } else {
              res.status(500).json({ error: "Internal server error" });
            }
          }
        }
      );

      // ============ CHEMISES ROUTES ============

      // Get chemises by bureau
      expressApp.get(
        "/api/bureaus/:bureauId/chemises",
        authenticateToken,
        (req, res) => {
          try {
            const { bureauId } = req.params;
            const chemises = db
              .prepare(
                "SELECT * FROM chemises WHERE bureau_id = ? ORDER BY cCreatedDate DESC"
              )
              .all(bureauId);
            res.json(chemises);
          } catch (error) {
            console.error("Error fetching chemises:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        }
      );

      // Create chemise
      expressApp.post(
        "/api/bureaus/:bureauId/chemises",
        authenticateToken,
        (req, res) => {
          try {
            const { bureauId } = req.params;
            const { chemise_name, chemise_place, cDescription } = req.body;

            if (!chemise_name || !chemise_place) {
              return res
                .status(400)
                .json({ error: "Chemise name and place are required" });
            }

            const stmt = db.prepare(`
            INSERT INTO chemises (chemise_name, chemise_place, cDescription, bureau_id)
            VALUES (?, ?, ?, ?)
          `);

            const result = stmt.run(
              chemise_name,
              chemise_place,
              cDescription || null,
              bureauId
            );

            res.status(201).json({
              message: "Chemise created successfully",
              chemiseId: result.lastInsertRowid,
            });
          } catch (error) {
            console.error("Error creating chemise:", error);
            if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
              res.status(409).json({ error: "Chemise place already exists" });
            } else {
              res.status(500).json({ error: "Internal server error" });
            }
          }
        }
      );

      // ============ DOCUMENTS ROUTES ============

      // Get documents by chemise
      expressApp.get(
        "/api/chemises/:chemiseId/documents",
        authenticateToken,
        (req, res) => {
          try {
            const { chemiseId } = req.params;
            const documents = db
              .prepare(
                `
            SELECT id_document, document_name, document_place, dDescription, 
                   dCreatedDate, document_type, chemise_id
            FROM documents 
            WHERE chemise_id = ? 
            ORDER BY dCreatedDate DESC
          `
              )
              .all(chemiseId);
            res.json(documents);
          } catch (error) {
            console.error("Error fetching documents:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        }
      );

      // Upload document
      expressApp.post(
        "/api/chemises/:chemiseId/documents",
        authenticateToken,
        upload.single("file"),
        (req, res) => {
          try {
            const { chemiseId } = req.params;
            const { document_name, document_place, dDescription } = req.body;
            const file = req.file;

            if (!document_name || !document_place || !file) {
              return res
                .status(400)
                .json({ error: "Document name, place, and file are required" });
            }

            // Get file extension to determine type
            const fileExtension = file.originalname
              .split(".")
              .pop()
              .toLowerCase();
            const allowedTypes = [
              "pdf",
              "doc",
              "docx",
              "txt",
              "jpg",
              "jpeg",
              "png",
              "gif",
              "xls",
              "xlsx",
              "ppt",
              "pptx",
            ];

            if (!allowedTypes.includes(fileExtension)) {
              return res.status(400).json({ error: "File type not allowed" });
            }

            const stmt = db.prepare(`
            INSERT INTO documents (document_name, document_place, dDescription, document_type, document_data, chemise_id)
            VALUES (?, ?, ?, ?, ?, ?)
          `);

            const result = stmt.run(
              document_name,
              document_place,
              dDescription || null,
              fileExtension,
              file.buffer,
              chemiseId
            );

            res.status(201).json({
              message: "Document uploaded successfully",
              documentId: result.lastInsertRowid,
            });
          } catch (error) {
            console.error("Error uploading document:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        }
      );

      // Download document
      expressApp.get(
        "/api/documents/:documentId/download",
        authenticateToken,
        (req, res) => {
          try {
            const { documentId } = req.params;

            const document = db
              .prepare(
                `
            SELECT document_name, document_type, document_data 
            FROM documents 
            WHERE id_document = ?
          `
              )
              .get(documentId);

            if (!document) {
              return res.status(404).json({ error: "Document not found" });
            }

            const mimeTypes = {
              pdf: "application/pdf",
              doc: "application/msword",
              docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              txt: "text/plain",
              jpg: "image/jpeg",
              jpeg: "image/jpeg",
              png: "image/png",
              gif: "image/gif",
              xls: "application/vnd.ms-excel",
              xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              ppt: "application/vnd.ms-powerpoint",
              pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            };

            res.setHeader(
              "Content-Type",
              mimeTypes[document.document_type] || "application/octet-stream"
            );
            res.setHeader(
              "Content-Disposition",
              `attachment; filename="${document.document_name}.${document.document_type}"`
            );
            res.send(document.document_data);
          } catch (error) {
            console.error("Error downloading document:", error);
            res.status(500).json({ error: "Internal server error" });
          }
        }
      );

      // ============ SEARCH ROUTES ============

      // Global search
      expressApp.get("/api/search", authenticateToken, (req, res) => {
        try {
          const { q: query } = req.query;

          if (!query) {
            return res.status(400).json({ error: "Search query is required" });
          }

          const searchPattern = `%${query}%`;

          const results = {
            services: db
              .prepare(
                `
              SELECT *, 'service' as type FROM services 
              WHERE service_name LIKE ? OR sDescription LIKE ?
            `
              )
              .all(searchPattern, searchPattern),

            bureaus: db
              .prepare(
                `
              SELECT b.*, s.service_name, 'bureau' as type 
              FROM bureaus b 
              JOIN services s ON b.service_id = s.id_service
              WHERE b.bureau_name LIKE ? OR b.bDescription LIKE ?
            `
              )
              .all(searchPattern, searchPattern),

            chemises: db
              .prepare(
                `
              SELECT c.*, b.bureau_name, s.service_name, 'chemise' as type
              FROM chemises c 
              JOIN bureaus b ON c.bureau_id = b.id_bureau
              JOIN services s ON b.service_id = s.id_service
              WHERE c.chemise_name LIKE ? OR c.cDescription LIKE ?
            `
              )
              .all(searchPattern, searchPattern),

            documents: db
              .prepare(
                `
              SELECT d.id_document, d.document_name, d.document_place, d.dDescription, 
                     d.dCreatedDate, d.document_type, d.chemise_id,
                     c.chemise_name, b.bureau_name, s.service_name, 'document' as type
              FROM documents d 
              JOIN chemises c ON d.chemise_id = c.id_chemise
              JOIN bureaus b ON c.bureau_id = b.id_bureau
              JOIN services s ON b.service_id = s.id_service
              WHERE d.document_name LIKE ? OR d.dDescription LIKE ?
            `
              )
              .all(searchPattern, searchPattern),
          };

          res.json(results);
        } catch (error) {
          console.error("Error performing search:", error);
          res.status(500).json({ error: "Internal server error" });
        }
      });

      // Test endpoint
      expressApp.get("/api/test", (req, res) => {
        res.json({ message: "Integrated backend is running!" });
      });

      // Start server
      server = expressApp.listen(PORT, "127.0.0.1", () => {
        console.log(`Integrated backend running on http://127.0.0.1:${PORT}`);
        isServerStarted = true;
        resolve();
      });

      server.on("error", (err) => {
        console.error("Server error:", err);
        reject(err);
      });
    } catch (error) {
      console.error("Error starting integrated server:", error);
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
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    },
  });

  const startUrl = isDev
    ? "http://localhost:5173"
    : `file://${path.join(__dirname, "../dist/index.html")}`;

  console.log("Loading frontend from:", startUrl);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.loadURL(startUrl);

  // Open DevTools in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  if (isAppReady) return;
  isAppReady = true;

  try {
    console.log("Starting integrated backend...");
    await startIntegratedServer();
    console.log("Backend started successfully, creating window...");
    createWindow();
  } catch (error) {
    console.error("Failed to start integrated backend:", error);
    createWindow();
  }
});

// Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.on("window-all-closed", () => {
  if (server) {
    console.log("Closing integrated server...");
    server.close(() => {
      console.log("Server closed");
    });
    server = null;
    isServerStarted = false;
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0 && isAppReady) {
    createWindow();
  }
});
