import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

// Base API URL pointing to the Express backend
const API_URL = 'http://localhost:5000/api/tasks';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch all tasks when the component mounts
  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Could not connect to the backend server. Make sure it is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. Add a new task (POST) OR Update an existing task (PUT)
  const handleSaveTask = async (formData) => {
    setError('');
    try {
      if (editingTask) {
        // UPDATE: PUT /api/tasks/:id
        const response = await fetch(`${API_URL}/${editingTask._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to update task');
        const updated = await response.json();

        // Replace the updated item in local state
        setTasks((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
        setEditingTask(null); // Exit edit mode
      } else {
        // CREATE: POST /api/tasks
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error('Failed to add task');
        const created = await response.json();

        // Prepend the new task to the list
        setTasks((prev) => [created, ...prev]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Operation failed');
    }
  };

  // 3. Delete a task (DELETE)
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    setError('');

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete task');

      // Optimistically remove from state
      setTasks((prev) => prev.filter((task) => task._id !== id));

      // If user was currently editing this deleted task, cancel edit mode
      if (editingTask && editingTask._id === id) {
        setEditingTask(null);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to delete task');
    }
  };

  // 4. Cancel Edit Mode
  const handleCancelEdit = () => {
    setEditingTask(null);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Task Management Application</h1>
        <p className="subtitle">MERN Stack CRUD Coding Assessment</p>
      </header>

      {/* Global Error Banner */}
      {error && <div className="error-banner">{error}</div>}

      <main className="main-content">
        {/* Form Section */}
        <section className="form-section">
          <TaskForm
            onSubmit={handleSaveTask}
            editingTask={editingTask}
            onCancelEdit={handleCancelEdit}
          />
        </section>

        {/* Tasks Section */}
        <section className="list-section">
          {loading ? (
            <div className="loading-state">Loading tasks...</div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={setEditingTask}
              onDelete={handleDeleteTask}
            />
          )}
        </section>
      </main>
    </div>
  );
}

