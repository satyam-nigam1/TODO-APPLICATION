import { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  // ✅ Electron se Tasks Load karna (SQLite se)
  useEffect(() => {
    if (window.electron) {
      window.electron.getTasks().then((fetchedTasks) => {
        setTasks(fetchedTasks);
      }).catch(error => {
        console.error("Error fetching tasks:", error);
      });
    }
  }, []);

  // ✅ New Task Add karna (Electron & SQLite)
  const addTask = async () => {
    if (task.trim() === "") return;
    
    try {
      await window.electron.addTask(task);
      const updatedTasks = await window.electron.getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Task add failed:", error);
    }

    setTask(""); // Input field reset 
  };

  // Task Delete
  const deleteTask = async (id) => {
    try {
      await window.electron.deleteTask(id);
      const updatedTasks = await window.electron.getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Task delete failed:", error);
    }
  };

  // Task Edit karna
  const startEditing = (index, taskText) => {
    setEditIndex(index);
    setEditText(taskText);
  };

  const saveTask = async (id) => {
    try {
      await window.electron.updateTask(id, editText);
      const updatedTasks = await window.electron.getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Task update failed:", error);
    }
    setEditIndex(null);
  };

  // Task Complete / Incomplete Toggle karna
  const toggleComplete = async (id, completed) => {
    try {
      await window.electron.markCompleted(id, !completed);
      const updatedTasks = await window.electron.getTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Task completion toggle failed:", error);
    }
  };

  return (
    <div className="container">
      <h1>To-Do List</h1>
      <div className="input-area">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter a task..."
        />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul className="task-list">
        {tasks.map((t, index) => (
          <li key={t.id} className={t.completed ? "completed" : ""}>
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => saveTask(t.id)}>✅ Save</button>
              </>
            ) : (
              <>
                <span>{t.title}</span>
                <button
                  className="toggle-btn"
                  onClick={() => toggleComplete(t.id, t.completed)}
                >
                  {t.completed ? "❌ Undo" : "✅ Complete"}
                </button>
                <button className="edit-btn" onClick={() => startEditing(index, t.title)}>
                  ✏ Edit
                </button>
                <button className="delete-btn" onClick={() => deleteTask(t.id)}>
                  ❌ Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
