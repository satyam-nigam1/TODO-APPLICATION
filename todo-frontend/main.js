const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const db = require("./database"); // Import Database

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
      sandbox: true,
    },
  });

  mainWindow.loadURL("http://localhost:5173");
  mainWindow.webContents.openDevTools();
});

ipcMain.on("add-task", (event, taskTitle) => {
  db.run("INSERT INTO tasks (title) VALUES (?)", [taskTitle], function (err) {
    if (err) {
      event.reply("task-added", false);
    } else {
      event.reply("task-added", true);
    }
  });
});

ipcMain.handle("get-tasks", async () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
});

ipcMain.on("delete-task", (event, taskId) => {
  db.run("DELETE FROM tasks WHERE id = ?", [taskId], function (err) {
    if (err) {
      event.reply("task-deleted", false);
    } else {
      event.reply("task-deleted", true);
    }
  });
});

ipcMain.on("update-task", (event, { id, newTitle }) => {
  db.run("UPDATE tasks SET title = ? WHERE id = ?", [newTitle, id], function (err) {
    if (err) {
      event.reply("task-updated", false);
    } else {
      event.reply("task-updated", true);
    }
  });
});

ipcMain.on("mark-completed", (event, { id, completed }) => {
  db.run("UPDATE tasks SET completed = ? WHERE id = ?", [completed, id], function (err) {
    if (err) {
      event.reply("task-marked", false);
    } else {
      event.reply("task-marked", true);
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
