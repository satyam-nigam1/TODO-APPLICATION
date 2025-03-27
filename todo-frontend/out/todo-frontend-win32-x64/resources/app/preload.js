const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  sendMessage: (channel, data) => ipcRenderer.send(channel, data),
  receiveMessage: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),

  addTask: (taskTitle) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send("add-task", taskTitle);
      ipcRenderer.once("task-added", (event, success) => {
        if (success) resolve();
        else reject("Failed to add task");
      });
    });
  },

  getTasks: () => ipcRenderer.invoke("get-tasks"),
  updateTask: (id, newTitle) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send("update-task", { id, newTitle });
      ipcRenderer.once("task-updated", (event, success) => {
        if (success) resolve();
        else reject("Failed to update task");
      });
    });
  },
  deleteTask: (id) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send("delete-task", id);
      ipcRenderer.once("task-deleted", (event, success) => {
        if (success) resolve();
        else reject("Failed to delete task");
      });
    });
  },
  markCompleted: (id, completed) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.send("mark-completed", { id, completed });
      ipcRenderer.once("task-marked", (event, success) => {
        if (success) resolve();
        else reject("Failed to mark task as completed/incomplete");
      });
    });
  }
});
