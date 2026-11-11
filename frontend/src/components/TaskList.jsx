import React from 'react';

/**
 * TaskList Component
 * - Displays tasks in modern card format (can also be table format).
 * - Fulfills Requirement 2 (Display tasks), 4 (Edit task trigger), 5 (Delete task), 6 (Empty message).
 * 
 * Props:
 * - tasks: Array of task objects
 * - onEdit: function(task) -> triggers edit mode in parent
 * - onDelete: function(id) -> triggers delete in parent
 */
export default function TaskList({ tasks, onEdit, onDelete }) {
  // Requirement 6: Display an appropriate message if there are no tasks
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>📋 No tasks found. Create your first task using the form above!</p>
      </div>
    );
  }

  return (
    <div className="task-list-section">
      <h2>All Tasks ({tasks.length})</h2>
      <div className="task-grid">
        {tasks.map((task) => (
          <div key={task._id} className={`task-card ${task.status.toLowerCase()}`}>
            <div className="task-header">
              <h3 className="task-title">{task.title}</h3>
              <span className={`badge badge-${task.status.toLowerCase()}`}>
                {task.status}
              </span>
            </div>

            <p className="task-description">
              {task.description || <em>No description provided</em>}
            </p>

            <div className="task-footer">
              <span className="task-date">
                {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : ''}
              </span>
              <div className="card-actions">
                <button
                  type="button"
                  className="btn btn-sm btn-edit"
                  onClick={() => onEdit(task)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-delete"
                  onClick={() => onDelete(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

