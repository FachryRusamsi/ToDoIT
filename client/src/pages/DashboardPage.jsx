import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import TaskList from '../components/TaskList';

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  const filtered = tasks.filter((t) =>
    filterStatus === 'all' ? true : t.status === filterStatus
  );

  const total = tasks.length;
  const done = tasks.filter((t) => t.status === 'done').length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Your deadlines</h2>
          <p className="text-sm text-base-content/70">
            Stay on top of your projects and tasks.
          </p>
        </div>
        <div className="flex gap-3">
          <select
            className="select select-bordered select-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/tasks/new')}
          >
            + New Task
          </button>
        </div>
      </div>

      <div className="stats bg-base-100 shadow-sm w-full">
        <div className="stat">
          <div className="stat-title">Total tasks</div>
          <div className="stat-value text-primary">{total}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Completed</div>
          <div className="stat-value text-success">{done}</div>
        </div>
      </div>

      <div className="mt-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : (
          <TaskList tasks={filtered} onDelete={handleDelete} />
        )}
      </div>
    </div>
  );
}
