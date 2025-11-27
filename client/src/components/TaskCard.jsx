import { useNavigate } from 'react-router-dom';

export default function TaskCard({ task, onDelete }) {
  const navigate = useNavigate();
  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  const badgeStatusMap = {
    pending: 'badge-warning',
    in_progress: 'badge-info',
    done: 'badge-success'
  };

  return (
    <div
      className={`card bg-base-100 shadow-sm border ${
        isOverdue ? 'border-error' : 'border-base-200'
      }`}
    >
      <div className="card-body gap-2">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="card-title text-base">{task.title}</h3>
            {task.dueDate && (
              <p className="text-xs text-base-content/60">
                Due:{' '}
                {new Date(task.dueDate).toLocaleDateString(undefined, {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`badge badge-sm ${badgeStatusMap[task.status]}`}>
              {task.status}
            </span>
            <span
              className={`badge badge-outline badge-xs ${
                task.priority === 'high'
                  ? 'badge-error'
                  : task.priority === 'medium'
                  ? 'badge-warning'
                  : 'badge-ghost'
              }`}
            >
              {task.priority} priority
            </span>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-base-content/80 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.attachmentUrl && (
          <a
            href={`http://localhost:5000${task.attachmentUrl}`}
            target="_blank"
            rel="noreferrer"
            className="link link-primary text-xs"
          >
            View attachment
          </a>
        )}

        <div className="card-actions justify-end mt-2">
          <button
            className="btn btn-xs btn-ghost"
            onClick={() => navigate(`/tasks/${task._id}/edit`)}
          >
            Edit
          </button>
          <button
            className="btn btn-xs btn-error"
            onClick={() => onDelete(task._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
