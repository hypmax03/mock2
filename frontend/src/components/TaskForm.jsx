import React, { useState, useEffect } from 'react';

/**
 * TaskForm Component
 * - Serves dual purpose: Creating a new task OR Editing an existing task.
 * - Uses controlled inputs (React state drives the input values).
 * 
 * Props:
 * - onSubmit: function(taskData) -> called when form is submitted
 * - editingTask: object | null -> if provided, form pre-fills with this task's data
 * - onCancelEdit: function() -> cancels edit mode and resets the form
 */
export default function TaskForm({ onSubmit, editingTask, onCancelEdit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Pending',
  });

  // Whenever editingTask changes (user clicked 'Edit' on a card), populate the form
  useEffect(() => {
    if (editingTask) {
      setFormData({
        title: editingTask.title || '',
        description: editingTask.description || '',
        status: editingTask.status || 'Pending',
      });
    } else {
      // Reset form if editingTask is cleared
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
      });
    }
  }, [editingTask]);

  // Generic change handler for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    // Send the data up to the parent App component
    onSubmit(formData);

    // If we were adding (not editing), clear the form
    if (!editingTask) {
      setFormData({
        title: '',
        description: '',
        status: 'Pending',
      });
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{editingTask ? '✏️ Edit Task' : '➕ Add New Task'}</h2>

      {/* Task Title */}
      <div className="form-group">
        <label htmlFor="title">Task Title *</label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="e.g. Complete practical test"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Task Description */}
      <div className="form-group">
        <label htmlFor="description">Task Description</label>
        <textarea
          id="description"
          name="description"
          placeholder="e.g. Connect MongoDB and build the React UI"
          rows="3"
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      {/* Task Status */}
      <div className="form-group">
        <label htmlFor="status">Task Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>

        {editingTask && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

